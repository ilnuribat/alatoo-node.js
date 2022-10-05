const Koa = require("koa")
const Router = require("koa-router")
const bodyparser = require("koa-bodyparser")
const Joi = require('joi');

const joiCreate = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().min(16).max(100).required(),
  gpa: Joi.number().min(0).max(4),
});


let id = 0;

async function main() {
  let collection = [];

  const app = new Koa();
  const HTTP_PORT = 8080;

  app.use(bodyparser());

  //middleware
  app.use(async (ctx, next) => {
    console.log(ctx.method, ctx.url);
    try {
      await next();
    } catch (e) {
      if (e.isJoi) {
        ctx.body = e;

        return;
      }

      ctx.throw(500);
    }
    console.log("After business logic")//this will happen at the end
  });

  const router = new Router();

  //get all students
  router.get('/students', (ctx) => {
    ctx.status = 200;
    ctx.body = collection
  });

  //get by id
  router.get('/students/:id', (ctx) => {
    const student = collection.find(({ id }) => id === ctx.params.id);

    if (!student) {
      ctx.throw(404);
    }

    ctx.body = student;
    ctx.status = 200;
  });

  //create student
  router.post('/students', async (ctx) => {
    let student = await joiCreate.validateAsync(ctx.request.body);

    id += 1;

    const studentDb = {
      ...student,
      id,
    };

    collection.push(studentDb);
    console.log(collection);

    ctx.body = studentDb;
    ctx.status = 201;
  });


  //patch student by id
  router.patch("/students/:id", (ctx) => {
    const studentId = Number(ctx.params.id);
    const student = ctx.request.body;
    const studentDb = collection.find((obj) => obj.id === studentId);

    console.log({ studentDb, collection, id: ctx.params.id });

    if (!studentDb) {
      ctx.throw(404);
    }

    const newStudent = {
      ...studentDb,
      ...student,
    }

    console.log(newStudent);

    collection = [
      ...collection
        .filter(({ id }) => id !== studentId),
      newStudent,
    ];

    ctx.body = newStudent;
    ctx.status = 200;
  });

  //delete student by id
  router.delete('/students/:id', (ctx) => {
    const studentId = Number(ctx.params.id);
    const studentDb = collection.find(({ id }) => id === studentId);

    if (!studentDb) {
      ctx.throw(404);
    }

    ctx.status = 200;
    collection = collection.filter(({ id }) => id !== studentId);
  });

  app.use(router.routes());

  app.listen(HTTP_PORT, () => {
    console.log('server started at port', HTTP_PORT);
  });

}

main().catch(console.log);

