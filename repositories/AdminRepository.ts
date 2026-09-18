import Event from "@/models/event.model";
import User from "@/models/user.model";

import { UserRole, UserStatus } from "@/lib/constants";

class AdminRepository {

  async getDashboardMetrics() {

    const userMetrics = await this.getUsersCollectionMetrics();
    const eventMetrics = await this.getEventsCollectionMetrics();

    return {
      ...userMetrics,
      ...eventMetrics
    };

  }

  async getUsersCollectionMetrics() {

    const pipeline = [
      {
        $facet: {
          totalUsers: [
            {
              $match: {
                role: {
                  $ne: UserRole.SUPER_ADMIN
                }
              }
            },
            { $count: "count" },
          ],
          eventOrganizers: [
            {
              $match: {
                role: UserRole.EVENT_ORGANIZER
              }
            },
            { $count: "count" }
          ],
          eventAttendees: [
            {
              $match: {
                role: UserRole.EVENT_ATTENDEE
              }
            },
            { $count: "count" }
          ],
          suspendedUsers: [
            {
              $match: {
                status: UserStatus.SUSPENDED
              }
            },
            { $count: "count" }
          ]
        }
      },
      {
        $project: {
          totalUsers: {
            $ifNull: [
              { $arrayElemAt: ["$totalUsers.count", 0] },
              0
            ]
          },

          eventOrganizers: {
            $ifNull: [
              { $arrayElemAt: ["$eventOrganizers.count", 0] },
              0
            ]
          },

          eventAttendees: {
            $ifNull: [
              { $arrayElemAt: ["$eventAttendees.count", 0] },
              0
            ]
          },

          suspendedUsers: {
            $ifNull: [
              { $arrayElemAt: ["$suspendedUsers.count", 0] },
              0
            ]
          }
        }
      }
    ];

    const [metrics] = await User.aggregate(pipeline);

    return metrics;

  }

  async getEventsCollectionMetrics() {

    const pipeline = [
      {
        $facet: {
          totalEvents: [
            { $count: "count" },
          ],
          upcomingEvents: [
            {
              $match: {
                startAt: {
                  $gte: new Date()
                }
              }
            },
            { $count: "count" }
          ],
        }
      },
      {
        $project: {
          totalEvents: {
            $ifNull: [
              { $arrayElemAt: ["$totalEvents.count", 0] },
              0
            ]
          },

          upcomingEvents: {
            $ifNull: [
              { $arrayElemAt: ["$upcomingEvents.count", 0] },
              0
            ]
          },
        }
      }
    ];

    const [metrics] = await Event.aggregate(pipeline);

    return metrics;

  }

}

export const adminRepository = new AdminRepository();