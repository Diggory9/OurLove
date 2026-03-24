"use client";

import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: string;
}

interface AchievementListProps {
  achievements: Achievement[];
}

export default function AchievementList({ achievements }: AchievementListProps) {
  const categories = [...new Set(achievements.map((a) => a.category))];
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div>
      {/* Overall progress */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-4 bg-primary-50 px-6 py-3 rounded-full">
          <span className="text-sm text-gray-600">
            Đã mở khoá{" "}
            <strong className="text-primary-600">
              {unlocked}/{achievements.length}
            </strong>{" "}
            thành tích
          </span>
          <div className="w-32 h-2 bg-primary-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all"
              style={{ width: `${(unlocked / achievements.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-10">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements
              .filter((a) => a.category === category)
              .map((achievement) => (
                <div
                  key={achievement.id}
                  className={cn(
                    "relative rounded-2xl p-5 border-2 transition-all",
                    achievement.unlocked
                      ? "bg-white border-primary-200 shadow-md"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0",
                        achievement.unlocked
                          ? "bg-gradient-to-br from-primary-100 to-primary-200"
                          : "bg-gray-200"
                      )}
                      dangerouslySetInnerHTML={{ __html: achievement.icon }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {achievement.description}
                      </p>
                      {/* Progress bar */}
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                          {achievement.unlocked && (
                            <span className="text-green-600 font-semibold">
                              Hoàn thành!
                            </span>
                          )}
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              achievement.unlocked
                                ? "bg-green-500"
                                : "bg-primary-400"
                            )}
                            style={{
                              width: `${Math.min(
                                (achievement.progress / achievement.maxProgress) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                      &#10003;
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
