import { useEffect, useRef, useState } from 'react';
import type { QAEntry } from '../types/conversation';

interface ConversationDisplayProps {
  entries: QAEntry[];
}

// Map technical field names to conversational questions
const questionMap: Record<string, string> = {
  'customer_name': 'What is your name?',
  'name': 'What is your name?',
  'customer_email': 'What is your email address?',
  'email': 'What is your email address?',
  'customer_postcode': 'What is your postcode?',
  'postcode': 'What is your postcode?',
  'customer_phone': 'What is your phone number?',
  'phone': 'What is your phone number?',
  'customer_address': 'What is your address?',
  'address': 'What is your address?',
  'customer_dob': 'What is your date of birth?',
  'dob': 'What is your date of birth?',
  'date_of_birth': 'What is your date of birth?',
  'customer_age': 'How old are you?',
  'age': 'How old are you?',
  'relationshipstatus': 'What is your relationship status?',
  'childrennum': 'How many children do you have?',
  'housingtype': 'What is your housing situation?',
  'monthlyincomeamount': 'What is your monthly income?',
};

function getConversationalQuestion(technical: string): string {
  const key = technical.toLowerCase().trim();
  return questionMap[key] || technical;
}

const numberWords: Record<number, string> = {
  0: 'No',
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
  11: 'Eleven',
  12: 'Twelve',
};

const housingTypes: Record<number | string, string> = {
  1: 'Private rent',
  2: 'Social rent',
  3: 'Homeowner',
  4: 'Living rent free',
  5: 'Supported or exempt',
  6: 'Boarder or lodger',
  7: 'Homeless',
  8: 'Temporary accommodation',
  9: 'Shared ownership',
};

function formatAnswer(question: string, answer: string | boolean | number | null): string {
  if (answer === null) return '-';
  if (typeof answer === 'boolean') return answer ? 'Yes' : 'No';

  const q = question.toLowerCase();

  // Format currency fields
  if (q.includes('income') || q.includes('amount')) {
    const num = typeof answer === 'number' ? answer : parseFloat(String(answer));
    if (!isNaN(num)) {
      return `£${num.toLocaleString()}`;
    }
  }

  // Format children count
  if (q.includes('children')) {
    const num = typeof answer === 'number' ? answer : parseInt(String(answer));
    if (!isNaN(num)) {
      if (num === 0) return 'No children';
      if (num === 1) return 'One child';
      const word = numberWords[num] || num.toString();
      return `${word} children`;
    }
  }

  // Format housing type
  if (q.includes('housing')) {
    return housingTypes[answer] || String(answer);
  }

  // Format relationship status
  if (q.includes('relationship')) {
    const status = String(answer).toLowerCase();
    const statusMap: Record<string, string> = {
      'single': 'Single',
      'married': 'Married',
      'divorced': 'Divorced',
      'widowed': 'Widowed',
      'separated': 'Separated',
      'partner': 'Living with partner',
      'cohabiting': 'Living with partner',
    };
    return statusMap[status] || String(answer).charAt(0).toUpperCase() + String(answer).slice(1);
  }

  return String(answer);
}

function extractUserName(entries: QAEntry[]): string | null {
  const nameEntry = entries.find(entry => {
    const q = entry.question.toLowerCase();
    return q.includes('name') && !q.includes('email');
  });

  if (nameEntry && typeof nameEntry.answer === 'string') {
    return nameEntry.answer;
  }

  return null;
}

function isConfirmationEntry(entry: QAEntry): boolean {
  const q = entry.question.toLowerCase();
  return q.includes('confirm') || q.includes('verified') || q.includes('data_confirmed');
}

function isEligibilityEntry(entry: QAEntry): boolean {
  const q = entry.question.toLowerCase();
  return q.includes('eligibilityamount') || q === 'eligibility' || q === 'benefit_amount';
}

export function ConversationDisplay({ entries }: ConversationDisplayProps) {
  const userName = extractUserName(entries);
  const [seenCount, setSeenCount] = useState(0);
  const isFirstRender = useRef(true);

  // Separate conversation entries from special entries, exclude null answers
  const conversationEntries = entries.filter(e =>
    !isConfirmationEntry(e) &&
    !isEligibilityEntry(e) &&
    e.answer !== null
  );
  const confirmationEntry = entries.find(e => isConfirmationEntry(e));
  const isConfirmed = confirmationEntry?.answer === true || confirmationEntry?.answer === 'true';
  const eligibilityEntry = entries.find(e => isEligibilityEntry(e));
  const eligibilityAmount = eligibilityEntry?.answer;

  useEffect(() => {
    // On first render, mark all as seen immediately (no animation)
    if (isFirstRender.current) {
      setSeenCount(conversationEntries.length);
      isFirstRender.current = false;
      return;
    }

    // For subsequent updates, animate new entries with a small delay
    if (conversationEntries.length > seenCount) {
      const timer = setTimeout(() => {
        setSeenCount(conversationEntries.length);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [conversationEntries.length, seenCount]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#222222]/40">
        <div className="w-12 h-12 rounded-full border-2 border-[#F7DB00]/30 border-t-[#F7DB00] animate-spin mb-4"></div>
        <p className="font-semibold animate-pulse-soft">Waiting for conversation...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {conversationEntries.map((entry, index) => {
        const conversationalQuestion = getConversationalQuestion(entry.question);
        const answerText = formatAnswer(entry.question, entry.answer);
        const isNew = index >= seenCount;

        return (
          <div
            key={`${entry.question}-${index}`}
            className="space-y-4 transition-all duration-500 ease-out"
            style={{
              opacity: isNew ? 0 : 1,
              transform: isNew ? 'translateY(8px)' : 'translateY(0)',
            }}
          >
            {/* Inbest Agent Question */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#F7DB00] flex items-center justify-center overflow-hidden shadow-md shadow-[#F7DB00]/30">
                <img src="/inbest_logo.png" alt="Inbest" className="w-6 h-6 object-contain" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-[#222222]/50 uppercase tracking-wider mb-1">Inbest Agent</p>
                <div className="bg-[#222222] text-white px-4 py-3 rounded-xl rounded-tl-sm shadow-md shadow-[#222222]/10">
                  <p className="text-[15px] leading-relaxed">{conversationalQuestion}</p>
                </div>
              </div>
            </div>

            {/* User Answer */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-md shadow-[#6366f1]/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-[#222222]/50 uppercase tracking-wider mb-1">{userName || 'User'}</p>
                <div className="bg-white text-[#222222] px-4 py-3 rounded-xl rounded-tl-sm shadow-md shadow-[#0E1A2B]/5 border border-[#0E1A2B]/5">
                  <p className="text-[15px] leading-relaxed font-medium">{answerText}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Confirmation Status */}
      {confirmationEntry && isConfirmed && (
        <div className="flex items-center justify-center gap-2 pt-2 text-[#222222]/50">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <p className="text-sm font-medium">Details confirmed</p>
        </div>
      )}

      {/* Eligibility Amount */}
      {eligibilityAmount && (
        <div className="mt-6 p-6 bg-gradient-to-br from-[#F7DB00]/10 to-[#F7DB00]/5 rounded-2xl border border-[#F7DB00]/20">
          <div className="text-center">
            <p className="text-sm font-semibold text-[#222222]/60 uppercase tracking-wider mb-2">
              Your Estimated Benefit
            </p>
            <p className="text-4xl font-bold text-[#222222]">
              £{typeof eligibilityAmount === 'number' ? eligibilityAmount.toLocaleString() : eligibilityAmount}
            </p>
            <p className="text-sm text-[#222222]/50 mt-2">
              per month
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
