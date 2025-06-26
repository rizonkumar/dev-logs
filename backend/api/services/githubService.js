const axios = require("axios");

const getContributionData = async (username, token) => {
  const headers = {
    Authorization: `bearer ${token}`,
  };
  const body = {
    query: `query {
      user(login: "${username}") {
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
    const calendar =
      response.data.data.user.contributionsCollection.contributionCalendar;
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

    return {
      totalContributions: calendar.totalContributions,
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
