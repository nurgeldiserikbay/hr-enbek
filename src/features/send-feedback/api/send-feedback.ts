import type { FeedbackRequest } from '../model/feedback-request.ts';

export function sendFeedback(request: FeedbackRequest): Promise<FeedbackRequest> {
  return Promise.resolve(request);
}
