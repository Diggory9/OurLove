import type { Metadata } from "next";
import { getAllQuizzes, getSiteConfig } from "@/lib/data";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import QuizGame from "@/components/quiz/QuizGame";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: "Quiz tình yêu",
    description: `${site.person1Name} & ${site.person2Name} hiểu nhau bao nhiêu?`,
    openGraph: {
      title: `Quiz tình yêu | ${site.siteName}`,
      description: `Thử thách xem bạn hiểu nửa kia bao nhiêu!`,
      locale: "vi_VN",
    },
  };
}

export default async function QuizPage() {
  const [questions, site] = await Promise.all([
    getAllQuizzes(),
    getSiteConfig(),
  ]);

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          title="Quiz tình yêu"
          subtitle={`${site.person1Name} & ${site.person2Name} hiểu nhau bao nhiêu?`}
        />

        {questions.length > 0 ? (
          <QuizGame
            questions={questions}
            person1Name={site.person1Name}
            person2Name={site.person2Name}
          />
        ) : (
          <p className="text-center text-gray-500 py-20">
            Chưa có câu hỏi nào. Hãy thêm qua trang quản trị!
          </p>
        )}
      </Container>
    </section>
  );
}
