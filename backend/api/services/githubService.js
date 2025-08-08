const axios = require("axios");

const getContributionData = async (username, token) => {
  const headers = {
    Authorization: `bearer ${token}`,
  };

  // Query 1: Contributions calendar and public repo count
  const contributionsBody = {
    query: `query ($username: String!) {
      user(login: $username) {
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
    variables: { username },
  };

  try {
    const response = await axios.post(
      "https://api.github.com/graphql",
      contributionsBody,
      { headers }
    );
    const contributionsUser = response.data.data.user;
    const calendar =
      contributionsUser.contributionsCollection.contributionCalendar;
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

    // Calculate longest and current streak
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

    // Calculate total stars across public repositories (first 100)
    // Query 2: Paginated star aggregation across all public repositories
    let totalStars = 0;
    let hasNextPage = true;
    let after = null;
    const starsQuery = `query ($username: String!, $after: String) {
      user(login: $username) {
        repositories(privacy: PUBLIC, ownerAffiliations: OWNER, first: 100, after: $after) {
          pageInfo { hasNextPage endCursor }
          nodes { stargazerCount }
        }
      }
    }`;
    while (hasNextPage) {
      const starsBody = { query: starsQuery, variables: { username, after } };
      const starsResp = await axios.post(
        "https://api.github.com/graphql",
        starsBody,
        { headers }
      );
      const repoConnection = starsResp.data.data.user.repositories;
      for (const repo of repoConnection.nodes || []) {
        totalStars += repo?.stargazerCount || 0;
      }
      hasNextPage = repoConnection.pageInfo?.hasNextPage || false;
      after = repoConnection.pageInfo?.endCursor || null;
    }

    return {
      totalContributions: calendar.totalContributions,
      publicRepositories: contributionsUser.repositories.totalCount,
      longestStreak: longestStreak,
      currentStreak: currentStreak,
      totalStars,
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
