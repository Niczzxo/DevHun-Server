const db = require("../config/db.js");

const getDashboardStats = async (req, res) => {
  const userEmail = req.token_email;
  const { my_jobs_only = "false" } = req.query;

  const isMyJobsOnly = my_jobs_only === "true";

  try {
    const matchStage = isMyJobsOnly ? { creator_email: userEmail } : {};

    const stats = await db.jobsCollection
      .aggregate([
        { $match: matchStage },

        {
          $facet: {
            statusBreakdown: [
              {
                $group: {
                  _id: "$status",
                  count: { $sum: 1 },
                },
              },
              {
                $project: {
                  status: "$_id",
                  count: 1,
                  _id: 0,
                },
              },
              {
                $group: {
                  _id: null,
                  items: { $push: { status: "$status", count: "$count" } },
                },
              },
              {
                $project: {
                  breakdown: {
                    pending: {
                      $ifNull: [
                        {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$items",
                                cond: { $eq: ["$$this.status", "pending"] },
                              },
                            },
                            0,
                          ],
                        },
                        { count: 0 },
                      ],
                    },
                    accepted: {
                      $ifNull: [
                        {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$items",
                                cond: { $eq: ["$$this.status", "accepted"] },
                              },
                            },
                            0,
                          ],
                        },
                        { count: 0 },
                      ],
                    },
                    completed: {
                      $ifNull: [
                        {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$items",
                                cond: { $eq: ["$$this.status", "completed"] },
                              },
                            },
                            0,
                          ],
                        },
                        { count: 0 },
                      ],
                    },
                    total: { $sum: "$items.count" },
                  },
                },
              },
              { $project: { breakdown: 1 } },
            ],

            jobsOverTime: [
              {
                $match: {
                  created_at: {
                    $gte: new Date(
                      Date.now() - 30 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
                  },
                },
              },
              {
                $group: {
                  _id: {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: { $toDate: "$created_at" },
                    },
                  },
                  count: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
              {
                $project: {
                  date: "$_id",
                  count: 1,
                  _id: 0,
                },
              },
            ],

            topCategories: [
              { $group: { _id: "$job_category", count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: 6 },
              {
                $project: {
                  category: "$_id",
                  count: 1,
                  _id: 0,
                },
              },
            ],

            jobTypes: [
              { $group: { _id: "$job_type", count: { $sum: 1 } } },
              {
                $project: {
                  type: "$_id",
                  count: 1,
                  _id: 0,
                },
              },
            ],

            experienceLevels: [
              { $group: { _id: "$experience_level", count: { $sum: 1 } } },
              {
                $project: {
                  level: "$_id",
                  count: 1,
                  _id: 0,
                },
              },
            ],
          },
        },
      ])
      .toArray();

    const result = stats[0] || {};

    const breakdown = result.statusBreakdown?.[0]?.breakdown || {
      pending: { count: 0 },
      accepted: { count: 0 },
      completed: { count: 0 },
      total: 0,
    };

    const response = {
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data: {
        totalJobs: breakdown.total,
        statusBreakdown: {
          pending: breakdown.pending.count || 0,
          accepted: breakdown.accepted.count || 0,
          completed: breakdown.completed.count || 0,
        },
        jobsOverTime: result.jobsOverTime || [],
        topCategories: result.topCategories || [],
        jobTypes: result.jobTypes || [],
        experienceLevels: result.experienceLevels || [],
      },
      meta: {
        filteredByUser: isMyJobsOnly,
        periodDays: 30,
        generatedAt: new Date().toISOString(),
      },
    };

    res.status(200).send(response);
  } catch {
    res.status(500).send({
      success: false,
      message: "Failed to retrieve dashboard statistics",
    });
  }
};

module.exports = { getDashboardStats };
