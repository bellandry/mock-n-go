import { faker } from "@faker-js/faker";
import { Field, FieldType } from "./types/mock";

/**
 * Generate a single value based on field type using Faker.js
 */
export function generateFieldValue(field: Field, index?: number): any {
  const { type, customValue } = field;

  switch (type) {
    // IDs
    case "uuid":
      return faker.string.uuid();
    case "number":
      return faker.number.int({ min: 1, max: 10000 });
    case "autoIncrement":
      return index !== undefined ? index + 1 : faker.number.int({ min: 1, max: 10000 });

    // Person
    case "fullName":
      return faker.person.fullName();
    case "firstName":
      return faker.person.firstName();
    case "lastName":
      return faker.person.lastName();
    case "email":
      return faker.internet.email();
    case "phone":
      return faker.phone.number();
    case "avatar":
      return faker.image.avatar();
    case "jobTitle":
      return faker.person.jobTitle();

    // Address
    case "address":
      return faker.location.streetAddress();
    case "city":
      return faker.location.city();
    case "country":
      return faker.location.country();
    case "zipCode":
      return faker.location.zipCode();
    case "street":
      return faker.location.street();
    case "state":
      return faker.location.state();

    // Internet
    case "url":
      return faker.internet.url();
    case "imageUrl":
      return faker.image.url();
    case "username":
      return faker.internet.username();
    case "password":
      return faker.internet.password();
    case "ip":
      return faker.internet.ip();
    case "userAgent":
      return faker.internet.userAgent();

    // Text
    case "paragraph":
      return faker.lorem.paragraph();
    case "sentence":
      return faker.lorem.sentence();
    case "word":
      return faker.lorem.word();
    case "slug":
      return faker.lorem.slug();
    case "description":
      return faker.lorem.sentences(2);

    // Date & Time
    case "date":
      return faker.date.recent().toISOString().split("T")[0];
    case "datetime":
      return faker.date.recent().toISOString();
    case "pastDate":
      return faker.date.past().toISOString();
    case "futureDate":
      return faker.date.future().toISOString();
    case "timestamp":
      return faker.date.recent().getTime();

    // Boolean & Numbers
    case "boolean":
      return faker.datatype.boolean();
    case "price":
      return parseFloat(faker.commerce.price());
    case "percentage":
      return faker.number.int({ min: 0, max: 100 });
    case "rating":
      return faker.number.float({ min: 0, max: 5, fractionDigits: 1 });

    // Commerce
    case "productName":
      return faker.commerce.productName();
    case "department":
      return faker.commerce.department();
    case "color":
      return faker.color.human();
    case "company":
      return faker.company.name();

    // Preset-specific types
    case "string":
      return faker.person.fullName();
    case "arrayMern":
      return faker.helpers.arrayElements(
        ["MongoDB", "Express", "React", "Node.js", "TypeScript", "Next.js", "Prisma", "PostgreSQL"],
        { min: 3, max: 6 }
      );
    case "github":
      return `https://github.com/${faker.internet.username()}`;
    case "currency":
      return faker.helpers.arrayElement(["USD", "EUR", "GBP", "CAD", "AUD"]);
    case "stock":
      return faker.number.int({ min: 0, max: 1000 });
    case "category":
      return faker.commerce.department();
    case "author":
      return faker.person.fullName();
    case "lorem":
      return faker.lorem.paragraph();
    case "likes":
      return faker.number.int({ min: 0, max: 10000 });
    case "comments":
      return faker.number.int({ min: 0, max: 500 });
    case "createdAt":
      return faker.date.recent().toISOString();
    case "title":
      return faker.lorem.sentence({ min: 3, max: 8 });
    case "excerpt":
      return faker.lorem.sentences(2);
    case "loremLong":
      return faker.lorem.paragraphs(5);
    case "publishedAt":
      return faker.date.past({ years: 1 }).toISOString();
    case "tags":
      return faker.helpers.arrayElements(
        ["JavaScript", "TypeScript", "React", "Node.js", "Web Dev", "Tutorial", "Guide", "Tips"],
        { min: 2, max: 4 }
      );
    case "readTime":
      return `${faker.number.int({ min: 1, max: 15 })} min read`;
    case "plan":
      return faker.helpers.arrayElement(["Free", "Starter", "Pro", "Enterprise"]);
    case "mrr":
      return faker.number.int({ min: 0, max: 10000 });
    case "status":
      return faker.helpers.arrayElement(["active", "inactive", "trial", "cancelled"]);
    case "joinedAt":
      return faker.date.past({ years: 2 }).toISOString();
    case "todoTitle":
      return faker.lorem.sentence({ min: 3, max: 6 });
    case "completed":
      return faker.datatype.boolean();
    case "priority":
      return faker.helpers.arrayElement(["low", "medium", "high", "urgent"]);
    case "dueDate":
      return faker.date.future().toISOString();
    case "dishName":
      return faker.helpers.arrayElement([
        "Grilled Salmon", "Caesar Salad", "Margherita Pizza", "Beef Burger",
        "Chicken Tikka", "Pad Thai", "Sushi Roll", "Pasta Carbonara"
      ]);
    case "foodCategory":
      return faker.helpers.arrayElement(["Appetizer", "Main Course", "Dessert", "Beverage", "Side Dish"]);
    case "calories":
      return faker.number.int({ min: 100, max: 1500 });
    case "vegetarian":
      return faker.datatype.boolean();

    // Custom
    case "custom":
      return customValue || null;

    default:
      return null;
  }
}

/**
 * Generate a single object with all fields
 */
export function generateMockObject(fields: Field[], index?: number): Record<string, any> {
  const obj: Record<string, any> = {};
  
  for (const field of fields) {
    obj[field.name] = generateFieldValue(field, index);
  }
  
  return obj;
}

/**
 * Generate an array of mock objects
 */
export function generateMockData(fields: Field[], count: number = 10): Record<string, any>[] {
  const data: Record<string, any>[] = [];
  
  for (let i = 0; i < count; i++) {
    data.push(generateMockObject(fields, i));
  }
  
  return data;
}

/**
 * Get paginated data from an array
 */
export function paginateData<T>(
  data: T[],
  page: number = 1,
  limit: number = 10
): {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} {
  const total = data.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

/**
 * Get all supported field types with labels
 */
export const FIELD_TYPES: { value: FieldType; label: string; category: string }[] = [
  // IDs
  { value: "uuid", label: "UUID", category: "IDs" },
  { value: "number", label: "Number", category: "IDs" },
  { value: "autoIncrement", label: "Auto Increment", category: "IDs" },
  
  // Person
  { value: "fullName", label: "Full Name", category: "Person" },
  { value: "firstName", label: "First Name", category: "Person" },
  { value: "lastName", label: "Last Name", category: "Person" },
  { value: "email", label: "Email", category: "Person" },
  { value: "phone", label: "Phone", category: "Person" },
  { value: "avatar", label: "Avatar URL", category: "Person" },
  { value: "jobTitle", label: "Job Title", category: "Person" },
  
  // Address
  { value: "address", label: "Address", category: "Address" },
  { value: "city", label: "City", category: "Address" },
  { value: "country", label: "Country", category: "Address" },
  { value: "zipCode", label: "Zip Code", category: "Address" },
  { value: "street", label: "Street", category: "Address" },
  { value: "state", label: "State", category: "Address" },
  
  // Internet
  { value: "url", label: "URL", category: "Internet" },
  { value: "imageUrl", label: "Image URL", category: "Internet" },
  { value: "username", label: "Username", category: "Internet" },
  { value: "password", label: "Password", category: "Internet" },
  { value: "ip", label: "IP Address", category: "Internet" },
  { value: "userAgent", label: "User Agent", category: "Internet" },
  
  // Text
  { value: "paragraph", label: "Paragraph", category: "Text" },
  { value: "sentence", label: "Sentence", category: "Text" },
  { value: "word", label: "Word", category: "Text" },
  { value: "slug", label: "Slug", category: "Text" },
  { value: "description", label: "Description", category: "Text" },
  
  // Date & Time
  { value: "date", label: "Date", category: "Date & Time" },
  { value: "datetime", label: "DateTime", category: "Date & Time" },
  { value: "pastDate", label: "Past Date", category: "Date & Time" },
  { value: "futureDate", label: "Future Date", category: "Date & Time" },
  { value: "timestamp", label: "Timestamp", category: "Date & Time" },
  
  // Boolean & Numbers
  { value: "boolean", label: "Boolean", category: "Boolean & Numbers" },
  { value: "price", label: "Price", category: "Boolean & Numbers" },
  { value: "percentage", label: "Percentage", category: "Boolean & Numbers" },
  { value: "rating", label: "Rating (0-5)", category: "Boolean & Numbers" },
  
  // Commerce
  { value: "productName", label: "Product Name", category: "Commerce" },
  { value: "department", label: "Department", category: "Commerce" },
  { value: "color", label: "Color", category: "Commerce" },
  { value: "company", label: "Company", category: "Commerce" },
  
  // Other
  { value: "custom", label: "Custom Value", category: "Other" },
];
