import {
  AcademicCapIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/solid";
import type { Flashcard } from "@prisma/client";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useState } from "react";
import FlippingCard from "../../../components/FlippingCard";
import Score from "../../../components/pages/flashcards/Score";
import Result from "../../../components/Result";
import { api } from "../../../utils/api";

interface FlashcardsProgress {
  learning: Flashcard[];
  know: Flashcard[];
}

const Flashcards = () => {
  const { query, push } = useRouter();
  const setId = query.id?.toString();
  const [cards, setCards] = useState<Flashcard[]>();
  const [cardIndex, setCardIndex] = useState<number>(0);
  const {
    data: studySet,
    isLoading,
    refetch,
    error,
  } = api.studySet.getById.useQuery(
    {
      id: setId!,
    },
    {
      enabled: !!setId,
      refetchOnWindowFocus: false,
      onSuccess(data) {
        setCards(data.cards);
      },
    }
  );
  const currentCard = cards?.[cardIndex];
  const [{ know, learning }, setProgress] = useState<FlashcardsProgress>({
    learning: [],
    know: [],
  });

  const addToKnow = () => {
    if (!currentCard) return;
    setProgress((prev) => ({ ...prev, know: [...prev.know, currentCard] }));
  };

  const addToLearning = () => {
    if (!currentCard) return;
    setProgress((prev) => ({
      ...prev,
      learning: [...prev.learning, currentCard],
    }));
  };

  const changeCard = (value: number) => {
    setCardIndex((prev) => prev + value);
  };

  if (isLoading || !setId) return <div>Loading flashcards...</div>;

  if (error) return <div>{error.message}</div>;

  const reviewToughTerms = () => {
    setCards(learning);

    setProgress((prev) => ({
      ...prev,
      learning: [],
    }));

    setCardIndex(0);
  };

  const resetFlashcards = () => {
    setCards(studySet.cards);
    setProgress({
      know: [],
      learning: [],
    });
    setCardIndex(0);
  };

  const backToStudySet = async () => {
    await push(`/study-set/${setId}`);
  };

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Flashcards" />
      <div className="bg-slate-100">
        <div className="m-auto max-w-[65rem] p-4 md:py-12">
          {cardIndex === cards?.length && setId && (
            <div>
              <h1 className="mb-8 text-3xl font-semibold">
                You finished! What&apos;s next?
              </h1>
              <Result
                know={know.length}
                learning={learning.length}
                firstButton={
                  learning.length > 0
                    ? {
                        text: "Review tough terms",
                        Icon: AcademicCapIcon,
                        callback: reviewToughTerms,
                      }
                    : {
                        text: "Reset flashcards",
                        Icon: ArrowPathIcon,
                        callback: resetFlashcards,
                      }
                }
                secondButton={{
                  text: "Back to study set",
                  Icon: ArrowUturnLeftIcon,
                  callback: backToStudySet,
                }}
              />
            </div>
          )}
          {studySet && cards && currentCard && (
            <div>
              <Score know={know.length} learning={learning.length} />
              <FlippingCard
                variant="large"
                refetchSet={refetch}
                id={currentCard.id}
                userId={studySet.userId}
                term={currentCard.term}
                definition={currentCard.definition}
                index={cardIndex}
                length={cards.length}
                changeCardCallback={changeCard}
                buttonVariant="description"
                addToKnow={addToKnow}
                addToLearning={addToLearning}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Flashcards;
