'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { type SignatureChallenge, SIGNED_IN_HOME } from '@/entities/sessions';

import { SignatureStep } from './signature-step.tsx';
import { StaffSignInForm } from './staff-sign-in-form.tsx';

type FlowState =
  | Readonly<{ step: 'credentials'; notice: string | null }>
  | Readonly<{ step: 'signature'; challenge: SignatureChallenge }>;

export function StaffSignInFlow() {
  const router = useRouter();
  const [state, setState] = useState<FlowState>({ step: 'credentials', notice: null });

  switch (state.step) {
    case 'credentials': {
      return (
        <StaffSignInForm
          notice={state.notice}
          onChallenge={(challenge) => {
            setState({ step: 'signature', challenge });
          }}
        />
      );
    }
    case 'signature': {
      return (
        <SignatureStep
          key={state.challenge.challengeId}
          challenge={state.challenge}
          onChallengeRenewed={(challenge) => {
            setState({ step: 'signature', challenge });
          }}
          onSigned={() => {
            router.replace(SIGNED_IN_HOME);
          }}
          onRestart={(notice) => {
            setState({ step: 'credentials', notice });
          }}
        />
      );
    }
  }
}
