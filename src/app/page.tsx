import Link from "next/link";
import { Button } from "../components/ui/button";
import { Github } from "lucide-react";

export default async function Home() {
  return (
    <div className="relative min-h-full overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 rounded-xl" />
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] rounded-xl" />

      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-4xl pt-16 pb-20 sm:pt-20 sm:pb-24">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-6 py-2 text-sm leading-6 text-gray-600 dark:text-gray-300 ring-1 ring-gray-900/10 dark:ring-gray-100/10 hover:ring-gray-900/20 dark:hover:ring-gray-100/20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                Community-driven knowledge platform
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Built by devs, for devs
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Remember that one person in class who took amazing notes that
              saved your life before exams? This is the digital,
              community-driven version of that.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-6 max-w-4xl mx-auto">
              <div className="relative group flex-1">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-sm opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative h-full p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ring-1 ring-gray-900/5 dark:ring-gray-100/10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col min-h-[140px]">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-semibold">
                      🎯
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-base">
                        Interview Ready
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        Prep for technical interviews with curated questions and
                        explanations
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group flex-1">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-sm opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative h-full p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ring-1 ring-gray-900/5 dark:ring-gray-100/10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col min-h-[140px]">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-lg font-semibold">
                      📚
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-base">
                        Quick Reference
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        Cheatsheets and concise explanations for rapid learning
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group flex-1">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-orange-600 rounded-lg blur-sm opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative h-full p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ring-1 ring-gray-900/5 dark:ring-gray-100/10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col min-h-[140px]">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-lg font-semibold">
                      🤝
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-base">
                        Community Driven
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        Built and improved by developers around the world
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              <p>
                Whether you're prepping for interviews, learning something new,
                or quickly refreshing your memory on an old concept — this is
                your go-to reference hub.
              </p>
              <p>
                Every topic aims to be as clear and concise as possible. Many
                come with quizzes, cheatsheets, and community-curated
                explanations to help you master them faster.
              </p>
            </div>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="https://github.com/andreborgesdev/the-devs-notebook"
                target="_blank"
                rel="noopener noreferrer"
                id="gitHubLink"
              >
                <Button
                  id="gitHubLinkButton"
                  className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 blur transition-opacity duration-200 -z-10" />
                  <Github className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Consider contributing</span>
                </Button>
              </Link>
            </div>

            <div className="mt-16 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ready to start your learning journey?
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white mt-2">
                Explore the topics in the sidebar to begin! 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
