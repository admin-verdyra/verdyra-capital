/**
 * Application Status Definitions
 *
 * Defines the valid application statuses for the merchant application lifecycle.
 * This is a MANUAL CURRENT-STAGE field - Admin can select ANY of these 9 statuses
 * from the CustomerTable dropdown. There is NO sequential transition validation.
 */

export const APPLICATION_STATUSES = [
  "Application Received",
  "Login Created",
  "Documents Pending",
  "Document Received",
  "Under Credit Evaluation",
  "Approved",
  "Rejected",
  "Sanctioned",
  "Disbursed",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/**
 * Check if a status value is valid (belongs to APPLICATION_STATUSES).
 */
export function isValidStatus(status: string): status is ApplicationStatus {
  return APPLICATION_STATUSES.includes(status as ApplicationStatus);
}