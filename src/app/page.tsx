import Link from "next/link";
import { Button } from "../components/ui/button";
import { Github } from "lucide-react";

export default async function Home() {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-3 prose prose-slate dark:prose-invert mx-auto max-w-4xl p-4">
        <p className="text-2xl font-bold">Built by devs, for devs 💡</p>
        <p className="text-lg font-bold">
          Remember that one person in class who took amazing notes that saved
          your life before exams? This is the digital, community-driven version
          of that.
        </p>
        <p className="text-md">
          We can all learn from each other, so there is clearly an added value
          in these notes being shared and editable by everyone. By having the
          community improve and create new content this would massively make
          everyone's educational IT journey a lot better.
        </p>
        <p className="text-md">
          Whether you're prepping for interviews, learning something new, or
          quickly refreshing your memory on an old concept — this is your go-to
          reference hub.
        </p>
        <p className="text-md">
          Every topic aims to be as clear and concise as possible. Many come
          with quizzes, cheatsheets, and community-curated explanations to help
          you master them faster.
        </p>
        <p className="text-md">
          The content is fully open and editable — built by the community,
          improved by the community. Join in and help shape the learning
          experience for others!
        </p>
        <p>Let the journey begin!</p>
        <Link
          href="https://github.com/andreborgesdev/the-devs-notebook"
          target="_blank"
          rel="noopener noreferrer"
          id="gitHubLink"
          className="w-full pt-2"
        >
          <Button
            id="gitHubLinkButton"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white w-full"
          >
            <Github />
            Consider contributing :)
          </Button>
        </Link>
      </div>
    </div>
  );
}
