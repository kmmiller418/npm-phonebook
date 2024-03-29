const express = require("express");
var morgan = require("morgan");
const app = express();

app.use(express.json());

morgan.token("postLogger", (request) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
});

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :postLogger"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];


app.get("/", (request, response) => {
  response.send("<h1>Welcome to the phonebook!</h1>");
});

app.get("/info", (request, response) => {
  const d = new Date();

  response.send(
    `<h3>Phonebook has info for ${persons.length} people</h3><h3>${d}<h3>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  let id = Math.floor(Math.random() * (100 - 1) + 1);

  if (persons.find((person) => person.id === id)) {
    id = generateId();
  }

  return id;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  } else if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

//lint wants me to define this but it's just NodeJs.Process
//I've fixed all other lint errors but this one will have to stay
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});