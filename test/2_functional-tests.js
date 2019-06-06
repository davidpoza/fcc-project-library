/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

const chaiHttp = require("chai-http");
const chai     = require("chai");
const Book     = require("../models/book");
const assert   = chai.assert;
chai.use(chaiHttp);

const server = require("../server");

function mySetup(done){
    let books = [
        new Book({title: "Canción de hielo y fuego: Juego de Tronos - George R.R. Martin", comments:["Esta saga de libros es perfecta, me compré todos de la misma edición para tener la colección completa de todos los libros iguales y quedan genial en mi estantería", "Si te gusto la serie tienes que leerte el libro, de lectura facil aunque no es moco de pavo, el libro me encanta ya e comprado los demas y voy por el tercero. buena lectura para el verano"]}),
        new Book({title: "Harry Potter y la piedra filosofal - J.K. Rowling", comments:["Quería iniciar a mi hijo en la lectura, algo que no fuera comics o tebeos.", "Este libro es ideal para niños entre 9 y 12 años, tengo hijos de esas edades y les ha encantado."]}),
        new Book({title: "Fortaleza Digital - Dan Brown", comments:["Sobre todo me ha gustado que los capítulos son cortos. Rara vez tardan más de cinco minutos en acabar."]}),
        new Book({_id:"5cf8d63530437d29a4efd045", title: "Maestros del Doom - David Kushner", comments:["Una historia fascinante. Cualquier fan de Doom y Quake devorará el libro de una sentada", "Un libro de lectura gozosa. Maestros del Doom recrea a la perfección una era en la que un par de marginados brillantes crearon su propia y retorcida versión del Sueño Americano"]}),
    ];
    Book.insertMany(books)
        .then(()=>done())
        .catch(err=>done(err));
}

function myTeardown(done){
    Book.deleteMany({})
        .then(()=>done())
        .catch(err=>done(err));
}
suite("Functional Tests", function() {
    suiteSetup(mySetup);
    suiteTeardown(myTeardown);
    /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
    test("#example Test GET /api/books", function(done){

        chai.request(server)
            .get("/api/books")
            .then(res=>{
                assert.equal(res.status, 200);
                assert.isArray(res.body, "response should be an array");
                assert.property(res.body[0], "commentcount", "Books in array should contain commentcount");
                assert.property(res.body[0], "title", "Books in array should contain title");
                assert.property(res.body[0], "_id", "Books in array should contain _id");
                done();
            })
            .catch(err=>done(err));
    });
    /*
  * ----[END of EXAMPLE TEST]----
  */

    suite("Routing tests", function() {


        suite("POST /api/books with title => create book object/expect book object", function() {

            test("Test POST /api/books with title", function(done) {
                chai.request(server)
                    .post("/api/books")
                    .send({title:"libro de ejemplo"})
                    .then(res=>{
                        assert.property(res.body, "comments", "Books should contain comments");
                        assert.property(res.body, "title", "Books in array should contain title");
                        assert.property(res.body, "_id", "Books in array should contain _id");
                        assert.isArray(res.body.comments, "comments property must be an array");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("Test POST /api/books with no title given", function(done) {
                chai.request(server)
                    .post("/api/books")
                    .then(res=>{
                        assert.equal(res.status, 400);
                        assert.equal(res.body.error, "title parameter is required", "error message ir correct");
                        done();
                    })
                    .catch(err=>done(err));
            });

        });


        suite("GET /api/books => array of books", function(){

            test("Test GET /api/books",  function(done){
                chai.request(server)
                    .get("/api/books")
                    .then(res=>{
                        assert.equal(res.status, 200);
                        assert.isArray(res.body, "result must be an array");
                        assert.property(res.body[0], "_id", "book must have _id");
                        assert.property(res.body[0], "title", "book must have title");
                        assert.property(res.body[0], "commentcount", "book must have commentcount");
                        done();
                    })
                    .catch(err=>done(err));
            });

        });


        suite("GET /api/books/[id] => book object with [id]", function(){

            test("Test GET /api/books/[id] with id not in db",  function(done){
                chai.request(server)
                    .get("/api/books/5cf8d63430437d29a4efd044")
                    .then(res=>{
                        assert.equal(res.status, 404);
                        assert.equal(res.body.error, "no book exists", "error message is correct");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("Test GET /api/books/[id] with valid id in db",  function(done){
                chai.request(server)
                    .get("/api/books/5cf8d63530437d29a4efd045")
                    .then(res=>{
                        assert.equal(res.status, 200);
                        assert.property(res.body, "comments", "Books should contain comments");
                        assert.property(res.body, "title", "Books in array should contain title");
                        assert.property(res.body, "_id", "Books in array should contain _id");
                        assert.isArray(res.body.comments, "comments property must be an array");
                        done();
                    })
                    .catch(err=>done(err));
            });

        });


        suite("POST /api/books/[id] => add comment/expect book object with id", function(){

            test("Test POST /api/books/[id] with comment", function(done){
                chai.request(server)
                    .get("/api/books/5cf8d63530437d29a4efd045")
                    .then(res=>{
                        assert.equal(res.status, 200);
                        assert.property(res.body, "comments", "Books should contain comments");
                        assert.property(res.body, "title", "Books in array should contain title");
                        assert.property(res.body, "_id", "Books in array should contain _id");
                        assert.isArray(res.body.comments, "comments property must be an array");
                        assert.isString(res.body.comments[0], "book has a comment");
                        done();
                    })
                    .catch(err=>done(err));
            });

        });

    });

});
