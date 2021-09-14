export class Person {
  type?: ["Person"] | ["Organization"];
  name: {
    language: string;
    value: string;
  };
  readonly _meta?: MetaDescriptor;
  constructor(descriptor: MetaDescriptor) {
    const { name, language = "en", ...meta } = descriptor;
    if (meta.type && meta.type.includes("Organization")) {
      this.type = ["Organization"];
    } else {
      this.type = ["Person"];
    }
    if (typeof name === "string" && typeof language === "string") {
      this.name = {
        language,
        value: name,
      };
    } else if (
      typeof name !== "string" &&
      !Array.isArray(name) &&
      name.value &&
      name.language
    ) {
      this.name = name;
    }
    this._meta = { ...meta } as MetaDescriptor;
  }
  get(property) {
    return this._meta[property];
  }
  toJSON() {
    return { ...this._meta, type: this.type, name: this.name };
  }
}

interface MetaDescriptor {
  type?: string | string[];
  [s: string]:
    | string
    | {
        language: string;
        value: string;
      }
    | string[]
    | Array<{
        language: string;
        value: string;
      }>;
}

export function asPerson(person, publicationLanguage?: string) {
  let { language } = person;
  if (person.name && person.name.language) {
    language = person.name.language;
  } else if (!language && typeof publicationLanguage === "string") {
    language = publicationLanguage;
  }
  if (person instanceof Person) {
    return person;
  } else if (person.name && typeof person.name === "string") {
    return new Person({ language, ...person });
  } else if (typeof person === "string") {
    return new Person({ name: person, language });
  } else if (person.name && person.name.value) {
    return new Person(person);
  } else {
    throw new Error("Invalid Person value in metadata");
  }
}
