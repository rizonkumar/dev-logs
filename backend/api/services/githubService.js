const axios = require("axios");

const getContributionData = async (username, token) => {
  const headers = {
    Authorization: `bearer ${token}`,
  };
  const body = {
    query: `query {
      user(login: "${username}") {
        repositories(privacy: PUBLIC) {
          totalCount
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }`,
  };

  try {
    const response = await axios.post("https://api.github.com/graphql", body, {
      headers,
    });
    const userData = response.data.data.user;
    const calendar = userData.contributionsCollection.contributionCalendar;
    let contributions = [];
    calendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        if (day.contributionCount > 0) {
          contributions.push({
            date: day.date,
            count: day.contributionCount,
            level: Math.min(day.contributionCount, 4),
          });
        }
      });
    });

    // Calculate longest streak
    const sortedContributions = contributions.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate = null;

    for (const contrib of sortedContributions) {
      const currentDate = new Date(contrib.date);
      if (lastDate) {
        const diffTime = currentDate - lastDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          currentStreak++;
        } else {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      lastDate = currentDate;
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    return {
      totalContributions: calendar.totalContributions,
      publicRepositories: userData.repositories.totalCount,
      longestStreak: longestStreak,
      contributions: contributions,
    };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    throw new Error("Could not fetch GitHub contribution data.");
  }
};

module.exports = {
  getContributionData,
};
