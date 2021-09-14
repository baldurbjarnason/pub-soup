import { asPerson } from "../dist/lib/person.js";
import tap from "tap";

tap.test("invalid person", async (test) => {
  test.throws(() => {
    const person = asPerson({
      haughty: true,
    });
    return person;
  });
});

tap.test("simple person", async (test) => {
  const person = asPerson({ name: "Testimus Maximus" });
  test.equal(person.name.value, "Testimus Maximus");
});

tap.test("person passthrough asPerson", async (test) => {
  const person = asPerson({ name: "Testimus Maximus" });
  const person2 = asPerson(person);
  test.equal(person, person2);
});

tap.test("value person", async (test) => {
  const person = asPerson({
    name: { value: "Testimus Maximus", language: "latin" },
  });
  test.equal(person.name.value, "Testimus Maximus");
});

tap.test("value organization", async (test) => {
  const person = asPerson({
    type: ["Organization"],
    name: { value: "Testimus Maximus", language: "latin" },
  });
  test.equal(person.type[0], "Organization");
});

tap.test("get meta", async (test) => {
  const person = asPerson({
    type: ["Organization"],
    name: { value: "Testimus Maximus", language: "latin" },
    additionalName: "Dingus",
  });
  test.equal(person.get("additionalName"), "Dingus");
});
