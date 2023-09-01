const therapistPath = (path: string) => `/therapist/${path}`;
const apiPath = {
  PROFILE: "/profile",
  THERAPIST_REQUESTS: therapistPath("requests"),
  THERAPIST_INVITATIONS: therapistPath("invitations"),
  THERAPIST_INVITE: therapistPath("invite"),
  THERAPIST_CLIENTS: therapistPath("clients"),
  THERAPIST_CLIENT_INFO: (clientId: string) => therapistPath(`clients/${clientId}`),
  THERAPIST_HEALTH_INFO: (clientId: string) => therapistPath(`clients/${clientId}/health-info`),
  THERAPIST_COUNT_ADVERSE_REACTION: (clientId: string) => therapistPath(`clients/${clientId}/adverse-reaction/count`),
  THERAPIST_CLIENT_REPORT_BY_DAY: (clientId: string) => therapistPath(`clients/${clientId}/daily-report`),
  THERAPIST_CLIENT_LISTENING_TIME_REPORT: (clientId: string) => therapistPath(`clients/${clientId}/listening-time-report`),
  THERAPIST_CLIENT_COMMENTS_REPORT: (clientId: string) => therapistPath(`clients/${clientId}/comment-report`),
  THERAPIST_CLIENT_COURSE: (clientId: string) => therapistPath(`clients/${clientId}/course`),
};

export default apiPath;
