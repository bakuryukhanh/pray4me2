import { faker } from "@faker-js/faker";
export const items = {
  TODO: [
    {
      id: "1",
      title: "Learn React",
      tag: {
        title: faker.helpers.arrayElement([
          "DEVELOPMENT",
          "TYPOGRAPHY",
          "DESIGN SYSTEM",
        ]),
        color: faker.color.rgb(),
      },
      description: "Learn how to use React in your daily life",
      user: [
        {
          name: "KT",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
        {
          name: "ST",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
      ],
    },
    {
      id: "2",
      title: "Learn Express",
      description: "Learn how to use Express in your daily life",
      tag: {
        title: faker.helpers.arrayElement([
          "DEVELOPMENT",
          "TYPOGRAPHY",
          "DESIGN SYSTEM",
        ]),
        color: faker.color.rgb(),
      },
      user: [
        {
          name: "KT",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
        {
          name: "ST",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
      ],
    },
    {
      id: "3",
      title: "Learn Vue",
      description: "Learn how to Vue  in your daily life",
      tag: {
        title: faker.helpers.arrayElement([
          "DEVELOPMENT",
          "TYPOGRAPHY",
          "DESIGN SYSTEM",
        ]),
        color: faker.color.rgb(),
      },
      user: [
        {
          name: "KT",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
        {
          name: "ST",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
      ],
    },
  ],
  "IN PROGRESS": [
    {
      id: "4",
      title: "Learn React",
      description: "Learn how to use React in your daily life",
      tag: {
        title: faker.helpers.arrayElement([
          "DEVELOPMENT",
          "TYPOGRAPHY",
          "DESIGN SYSTEM",
        ]),
        color: faker.color.rgb(),
      },
      user: [
        {
          name: "KT",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
        {
          name: "ST",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
      ],
    },
    {
      id: "5",
      title: "Learn Express",
      description: "Learn how to use Express in your daily life",
      tag: {
        title: faker.helpers.arrayElement([
          "DEVELOPMENT",
          "TYPOGRAPHY",
          "DESIGN SYSTEM",
        ]),
        color: faker.color.rgb(),
      },
      user: [
        {
          name: "KT",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
        {
          name: "ST",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
      ],
    },
    {
      id: "6",
      title: "Learn Vue",
      description: "Learn how to use Vue in your daily life",
      tag: {
        title: faker.helpers.arrayElement([
          "DEVELOPMENT",
          "TYPOGRAPHY",
          "DESIGN SYSTEM",
        ]),
        color: faker.color.rgb(),
      },
      user: [
        {
          name: "KT",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
        {
          name: "ST",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
      ],
    },
  ],
  DONE: [
    {
      id: "7",
      title: "Learn React",
      description: "Learn how to use React in your daily life",
      tag: {
        title: faker.helpers.arrayElement([
          "DEVELOPMENT",
          "TYPOGRAPHY",
          "DESIGN SYSTEM",
        ]),
        color: faker.color.rgb(),
      },
      user: [
        {
          name: "KT",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
        {
          name: "ST",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
      ],
    },
    {
      id: "8",
      title: "Learn Express",
      description: "Learn how to use Rust in your daily life",
      tag: {
        title: faker.helpers.arrayElement([
          "DEVELOPMENT",
          "TYPOGRAPHY",
          "DESIGN SYSTEM",
        ]),
        color: faker.color.rgb(),
      },
      user: [
        {
          name: "KT",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
        {
          name: "ST",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
      ],
    },
    {
      id: "9",
      title: "Learn Vue",
      description: "Learn how to use Go in your daily life",
      tag: {
        title: faker.helpers.arrayElement([
          "DEVELOPMENT",
          "TYPOGRAPHY",
          "DESIGN SYSTEM",
        ]),
        color: faker.color.rgb(),
      },
      user: [
        {
          name: "KT",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
        {
          name: "ST",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
      ],
    },
  ],
};
