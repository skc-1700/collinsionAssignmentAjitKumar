Feature: Activity Ranking – City-Based Weather Forecast with Autocomplete (Mobile)

  Background:
    Given the app is installed and launched on a mobile device
    And the device has an active internet connection

  # ─── Autocomplete ───

  Scenario: Autocomplete suggestions appear as user types
    When I tap the city search input
    And I type "Lon"
    Then I should see autocomplete suggestions within 2 seconds
    And each suggestion should display a city name and country

  Scenario: Selecting an autocomplete suggestion populates the input
    Given I have typed "Par" in the search input
    And autocomplete suggestions are visible
    When I tap on "Paris, France"
    Then the search input should display "Paris, France"
    And the autocomplete dropdown should close

  Scenario: No results for gibberish input
    When I type "xyzzzqqq" in the search input
    Then no autocomplete suggestions should appear

  Scenario: Autocomplete works with iOS predictive keyboard
    Given I am using an iOS device
    When I tap the city search input
    And the iOS predictive keyboard suggests a city name
    And I tap the keyboard suggestion
    Then the typed text should update in the search input
    And autocomplete suggestions should reflect the updated text

  Scenario: Autocomplete works with Android Gboard
    Given I am using an Android device
    When I tap the city search input
    And I type "Ber" using Gboard
    Then autocomplete suggestions should appear
    And suggestions should include "Berlin"

  # ─── Activity Ranking ───

  Scenario: 7-day activity ranking loads after city selection
    Given I have selected "London, United Kingdom" from autocomplete
    When the ranking data finishes loading
    Then I should see exactly 7 day sections
    And each day section should contain 4 activity cards

  Scenario: Each activity card displays required fields
    Given the ranking results are displayed
    Then each activity card should show:
      | Field     |
      | Date      |
      | Activity  |
      | Rank      |
      | Reasoning |
    And the rank should be between 1 and 10

  Scenario: Supported activities are present
    Given the ranking results are displayed for "Tokyo, Japan"
    Then the activities listed should include:
      | Activity             |
      | Skiing               |
      | Surfing              |
      | Outdoor Sightseeing  |
      | Indoor Sightseeing   |

  # ─── Edge Cases ───

  Scenario: Offline state shows error
    Given I have disabled the network connection
    When I type "Rome" and select a suggestion
    Then I should see an error message "Failed to fetch weather data"

  Scenario: Slow network shows loading indicator
    Given the network is throttled to 2G speed
    When I select "Sydney, Australia" from autocomplete
    Then a loading spinner should be visible
    And it should disappear when results load

  Scenario: Device rotation preserves results
    Given the ranking results are displayed for "New York"
    When I rotate the device from portrait to landscape
    Then the ranking results should still be visible
    And no data should be re-fetched

  Scenario: Rapid typing debounces API calls
    When I rapidly type "London" character by character
    Then the app should debounce and make at most 2 geocoding API calls
    And the final suggestions should match "London"

  Scenario: Special characters in search
    When I type "!!@@##" in the search input
    Then no autocomplete suggestions should appear
    And the app should not crash
