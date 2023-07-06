/* eslint-disable max-len */
import { environment as env } from '../../environments/environment';

export const endpoints = {
  auth: {
    updatePassword: `${env.backendUrl}/${env.version}/auth/change-password`,
    requestPasswordReset: `${env.backendUrl}/${env.version}/auth/reset-password/send-email`,
    resetPassword: `${env.backendUrl}/${env.version}/auth/reset-password/validate`,
    refresh: `${env.backendUrl}/${env.version}/auth/jwt/refresh`,
    me: `${env.backendUrl}/${env.version}/auth/jwt/me`,
    facebook: `${env.backendUrl}/${env.version}/auth/facebook`,
    facebookRedirect: code =>
      `${env.backendUrl}/${env.version}/auth/facebook/redirect?code=${code}`,
    linkedin: `${env.backendUrl}/${env.version}/auth/linkedin`,
    linkedinRedirect: code =>
      `${env.backendUrl}/${env.version}/auth/linkedin/redirect?code=${code}`,
    login: `${env.backendUrl}/${env.version}/auth/login`,
    logout: `${env.backendUrl}/${env.version}/auth/logout`,
    register: `${env.backendUrl}/${env.version}/user`,
    laus: `${env.backendUrl}/${env.version}/user/laus/pt`,
    profile: id => `${env.backendUrl}/${env.version}/user/${id}`,
    image: () => `${env.backendUrl}/${env.version}/photo`,
    cv: id => `${env.backendUrl}/${env.version}/user/${id}/cv`,
  },
  personal: {
    counties: `${env.backendUrl}/${env.version}/county`,
    county: id => `${env.backendUrl}/${env.version}/county/${id}`,
    districts: `${env.backendUrl}/${env.version}/district`,
    district: id => `${env.backendUrl}/${env.version}/district/${id}`,
  },
  user: {
    userImage: id => `${env.backendUrl}/${env.version}/user/${id}/image`,
    userPhotos: (limit, page) =>
      `${env.backendUrl}/${env.version}/photo?limit=${limit}&page=${page}&relations=user`,
    magicPowder: id =>
      `${env.backendUrl}/${env.version}/algorithm/magic-powder/${id}`,
    magicAlgorithm: `${env.backendUrl}/${env.version}/algorithm/magic`,
    freelancerStats: id =>
      `${env.backendUrl}/${env.version}/user/${id}/freelancer/statistics`,
    sendMonthlyEmail: `${env.backendUrl}/${env.version}/user/admin/send-monthly-payment-email`,
    userCV: id => `${env.backendUrl}/${env.version}/user/${id}/cv`,
    allUsers: (page, filter) =>
      `${env.backendUrl}/${env.version}/user/?limit=10&page=${page}&status=approved${filter}&relations=service`,
    allPendingUsers: (page, filter) =>
      `${env.backendUrl}/${env.version}/user/?limit=10&page=${page}&status=pending${filter}`,
    allCompanies: (page, filter) =>
      `${env.backendUrl}/${env.version}/user/?limit=10&page=${page}&${filter}`,
    allFreelancers: (page, filter) =>
      `${env.backendUrl}/${env.version}/user/?limit=10&page=${page}&${filter}`,
    allMonthlyPayments: (page, year, month) =>
      `${env.backendUrl}/${env.version}/user/admin/monthly-report?year=${year}&month=${month}&limit=10&page=${page}`,
    user: id => `${env.backendUrl}/${env.version}/user/${id}?relations=service`,
    userProfile: id =>
      `${env.backendUrl}/${env.version}/user/${id}?relations=service&relations=lau1&relations=lau2`,
    districts: `${env.backendUrl}/${env.version}/user/laus/pt`,
    cities: `${env.backendUrl}/${env.version}/user/laus2/pt`,
    statistics: `${env.backendUrl}/${env.version}/user/admin/statistics`,
  },
  professional: {
    categories: `${env.backendUrl}/${env.version}/professional-category?limit=0`,
    category: id =>
      `${env.backendUrl}/${env.version}/professional-category/${id}`,
    activities: `${env.backendUrl}/${env.version}/professional-activity`,
    activity: id =>
      `${env.backendUrl}/${env.version}/professional-activity/${id}?relations=category`,
    services: `${env.backendUrl}/${env.version}/professional-service`,
    service: id =>
      `${env.backendUrl}/${env.version}/professional-service/${id}?relations=activity`,
  },
  proposal: {
    createProposal: `${env.backendUrl}/${env.version}/business-proposal`,
    statistics: `${env.backendUrl}/${env.version}/business-proposal/admin/statistics`,
    sendMessage: uuid =>
      `${env.backendUrl}/${env.version}/business-proposal/${uuid}/send-message`,
    // eslint-disable-next-line max-len
    allProposal: (page, filter) =>
      `${env.backendUrl}/${env.version}/business-proposal/?limit=10&page=${page}&${filter}&relations=buyer&relations=seller`,
    proposal: uuid =>
      `${env.backendUrl}/${env.version}/business-proposal/${uuid}?relations=buyer&relations=seller`,
    buyerCancel: uuid =>
      `${env.backendUrl}/${env.version}/business-proposal/${uuid}/buyer-reject`,
    freelancerCancel: uuid =>
      `${env.backendUrl}/${env.version}/business-proposal/${uuid}/freelancer-reject`,
    deleteProposal: uuid =>
      `${env.backendUrl}/${env.version}/business-proposal/${uuid}`,
    freelancerAccept: uuid =>
      `${env.backendUrl}/${env.version}/business-proposal/${uuid}/freelancer-accept`,
    buyerCheckout: uuid =>
      `${env.backendUrl}/${env.version}/business-proposal/${uuid}/buyer-checkout`,
    buyerNewOffer: uuid =>
      `${env.backendUrl}/${env.version}/business-proposal/${uuid}/buyer-new-offer`,
    userProposals: (id, status, role, roleRelation) =>
      `${env.backendUrl}/${env.version}/business-proposal?limit=100&page=1&${role}=${id}&status=${status}&relations=${roleRelation}`,
  },
};
