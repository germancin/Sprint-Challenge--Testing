const mongoose = require('mongoose');
const chai = require('chai');
const chaihttp = require('chai-http');
const {expect} = chai;
const sinon = require('sinon');
const server = require('./server');

const Game = require('./models');
chai.use(chaihttp);

describe('Games', () => {
    before(done => {
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://germancin:secure123@159.65.170.21/test');
        const db = mongoose.connection;
        db.on('error', () => console.error.bind(console, 'connection error'));
        db.once('open', () => {
            console.log('we are connected');
            done();
        });
    });

    after(done => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
            console.log('we are disconnected');
        });
    });
    // declare some global variables for use of testing
    // hint - these wont be constants because you'll need to override them.

    let gameId;

    beforeEach(done => {
        // write a beforeEach hook that will populate your test DB with data
        // each time this hook runs, you should save a document to your db
        // by saving the document you'll be able to use it in each of your `it` blocks
        new Game({
            title: 'Mario Car',
            genre: 'adventure',
            releaseDate: 'January 27, 1988'
        }).save((err, resp) => {
            if (err) done();
            gameId = resp.id;
            done();
        });
    });
    afterEach(done => {
        // simply remove the collections from your DB.
        Game.remove({}, (err) => {
            if (err) done();
            mongoose.connection.db.dropDatabase();
            done();
        });
    });

    describe('[POST] /api/game/create', () => {
        it('should create a new game', (done) => {
            const game = {
                title: 'Mortal Kombat.',
                genre: 'fight',
                releaseDate: 'September 20, 1982',
            };

            chai.request(server)
                .post('/api/game/create')
                .send(game)
                .end((err, res) => {
                    if (err) done();
                    expect(res.status).to.equal(200);
                    expect(res.body.title).to.equal('Mortal Kombat.');
                    done();
                });
        });
    });

    // test the PUT here
    describe('[PUT] /api/game/update', () => {
        it('should update a game by id', (done) => {

            const dataToUpdate = {
                id: gameId,
                title: 'Mario Car II.',
            };

            chai.request(server)
                .put('/api/game/update')
                .send(dataToUpdate)
                .end((err, resp) => {
                    if (err) {
                        done();
                    }
                    expect(resp.body.title).to.equal(dataToUpdate.title);
                });
            done();
        });
    });

    // test the GET here
    describe('[GET] /api/game/get', () => {
        it('should create a new game', (done) => {
            chai.request(server)
                .get('/api/game/get')
                .end((err, resp) => {
                    if (err) {
                        console.error(err);
                        done();
                    }
                    expect(resp.status).to.equal(200);
                });
            done();
        });

        it('should return an object', (done) => {
            chai.request(server)
                .get('/api/game/get')
                .end((err, resp) => {
                    if (err) {
                        console.error(err);
                        done();
                    }
                    expect(typeof resp.body).to.equal("object");
                });
            done();
        });
    });




    // --- Stretch Problem ---
    // Test the DELETE here
});
