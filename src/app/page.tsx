import Link from "next/link";
import { Button } from "../components/ui/button";
import { Github } from "lucide-react";

export default async function Home() {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-3">
        <p className="text-2xl font-bold">
          This community was made with ❤️ from devs to devs
        </p>
        <p className="text-md">
          Do you remember those really well put together notes that someone made
          in college that just saved your life for a test? That's what this
          community aspires to do!
        </p>
        <p className="text-md">
          We can all learn from each other, so there is clearly an added value
          in these notes being shared and editable by everyone. By having the
          community improve and create new content this would massively make
          everyone's educational IT journey a lot better.
        </p>
        <p className="text-md">
          This platform can be a great tool, not only to study for job
          interviews, but also to use in our daily lives as IT professionals.
          For example, it is a place where we can quickly refresh our memory on
          a specific topic we haven't worked with for a while, or even to learn
          something new quickly.
        </p>
        <p className="text-md">
          The main goal is that the notes stay as concise and informative as
          possible. Plus, we should strive to have a Q&A/quiz for each topic
          because sometimes the best way to learn is by asking the right
          questions. Also, it would be good to have some kind of cheatsheet per
          topic for a fast information check. The topics can range over all
          kinds of IT related fields.
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
