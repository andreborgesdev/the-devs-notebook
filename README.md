# The dev's notebook 📚

## This community was made with ❤️ from devs to devs

Do your remember those really well put together notes that someone made on college that just saved your life for a test? That's what this community aspires to do!

We can all learn from each other, so there is clearly an added value of these notes being shared and editable by everyone. By having the community improving and creating new content this would massively make everyone's educational IT journey a lot better.

This platform can be a great tool, not only to study for job interviews, but also to use it in our daily lives as IT professionals. For example, it is a place where we can quickly refresh our memory in a specific topic we haven't worked with for a while, or even to learn something new quickly.

The main goal is that the notes stay as concise and informative as possible. Plus, we should strive to have a Q&A/quizz for each topic because sometimes the best way to learn is by ask the right questions. Also, it would be good to have some kind of cheatsheet per topic for a fast information check. The topics can range on all kinds of IT related fields.

## Technical introduction

The platform was designed with a simple architecture in mind in order to motivate and be easy for devs with all kinds of experience levels to contribute.

The core part of the platform is the content, which is stored in markdown files to make it easier to edit and create new content. We use a data type that mimics a tree-like structure to store all the content available in the platform. Bellow you can see the interface used for that and also where each property is used:

```ts
ContentItem {
    title: string; // Displayed on the sidebar and page title
    link: string; // URL slug and markdown file name
    icon: ReactNode | string; // Displayed on the sidebar and page title
    subContent?: ContentItem[] // Child content
}
```

We use a file (`src/data/Content.tsx`) as persistent layer to store all the current content. Since the platform is made in a dynamic and decoupled way, this is the main part of it. The data described on `Content` is going to be used to dynamically create the UI components.

Since the platform is already created, to edit content is really as simple as only having to interact with the markdown files, and all the changes will be automatically applied. Additionaly, for the creation we just have to add a new entry to `Content`.

To see the steps on how to create/edit content go to the section bellow.

## Installation

In the project directory, run the following to install:

### `yarn`

## Run

In the project directory, run the following to run the project locally:

### `yarn start`

It runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

For more information regarding yarn, check out - https://yarnpkg.com/

## Contribute 🤝🥇

This is a platform made from devs to devs! Everyone is welcomed and encouraged to contribute in order to create the best content possible for everyone. The main, but not restricted to, ways to contribute are:

- Improve the content. This platform is all about sharing knowledge between us devs and so, content is the central part of it all. To improve it, you can:
  - Improve the quality of already exiting content
  - Extend existing content by adding more topics/informations/Q&As for it. We are all about learning something new
  - Create content around new topics. This platform is not only directed to a subset of dev activites. In fact, the goal is that we have a variety of topics that cover, ideally, all dev topics.
- Improve the platform itself. This can be done either by:
  - Improving the UI/UX to make the experience smoother and more enjoyable
  - Improving the codebase and infrastructure of the project
- You can take a look at [open issues](https://github.com/andreborgesdev/the-devs-notebook/issues) for getting more information about current or upcoming tasks

## How to contribute ❓

### Content

To do something related to the content go the the 'src/resources' folder and you will find the existing markdown files that host the content.

#### Editing existing content

To edit existing content you just need to edit the respective markdown file. After saving the changes they will directly be applied.

#### Creating new content

If you are creating new content, please create a new markdown file for it following the naming convention observed for the other files (all lowercase with "-" serving as spaces). When writing the content, try to follow the same content layout as observed for the already existing content to make it more intuitive and streamlined for the user.

To make the content you are creating visible on the UI you just have to add a new entry to the to the `Content` data structure under `/src/data/Content.tsx`. In the section above you have a description of where each field is used, so that you have an idea of the values you should pass to them.

NOTE: Since the `link` field is both used for the URL slug and markdown file resolution, you should pay attention that the value in this field and the file name match, otherwise you will get a 404 when you try to navigate to the specified URL or click on the sidebar item.

## Tips

- If you are using an editor to interact with the markdown files, consider downloading a markdown-related plugin as they improve the experience a lot. For example, for VSCode, the "Markdown Enchanced" is quite good.

## Want to discuss? 💬

Have any questions, doubts or want to present your opinions, views? You're always welcome. You can [start discussions](https://github.com/andreborgesdev/the-devs-notebook/discussions).
