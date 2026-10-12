import { z } from 'zod';

import { type SelfCheckTopic, selfCheckTopicSchema, type SelfCheckTopicSummary } from '../model/self-check.ts';
import { SELF_CHECK_MOCK } from './self-check.mock.ts';

const readTopics = () => z.array(selfCheckTopicSchema).parse(SELF_CHECK_MOCK);

export function getSelfCheckTopics(): Promise<SelfCheckTopicSummary[]> {
  return Promise.resolve(
    readTopics().map(({ questions, ...topic }) => ({ ...topic, questionCount: questions.length })),
  );
}

export function getSelfCheckTopic(id: string): Promise<SelfCheckTopic | undefined> {
  return Promise.resolve(readTopics().find((topic) => topic.id === id));
}
