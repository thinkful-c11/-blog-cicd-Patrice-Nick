const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('BlogPosts', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  })

  it('should list post on GET', function() {
    return chai.request(app)
      .get('/blog-posts/')
      .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');

          res.body.length.should.be.at.least(1);
          const expectedKeys = ['title', 'content', 'author', 'publishDate'];
			    res.body.forEach(function(item){
				      item.should.be.a('object');
				      item.should.include.keys(expectedKeys);
			    });
      });
    });

    it('should add an blog post on POST', function(){
		const newItem = {title: 'sugar honey ice tea', content: 'stuff you want to read', author: 'somebody cool', publishDate:452725};
		return chai.request(app)
			   .post('/blog-posts/')
			   .send(newItem)
			   .then(function(res){
				       res.should.have.status(201);
				       res.should.be.jsons;
				       res.body.should.be.a('object');
				       res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate');
				       res.body.id.should.not.be.null;
				       res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
			   });
	});


    it('should update blog post on PUT', function(){
		const updateData = {
			title: 'bacon',
			content: 'meat',
      author: 'pigs',
      publishDate: 236353
		};
		return chai.request(app)
			.get('/blog-posts/:id')
			.then(function(res){
				updateData.id = res.body[0].id;
				return chai.request(app)
					.put(`routes/blogposts/${updateData.id}`)
					.send(updateData)
			})
			.then(function(res){
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.deep.equal(updateData);
			});
	});

  it('should delete blog post on DELETE', function() {
		return chai.request(app)
			.get('/blogposts/:id')
			.then(function(res){
				return chai.request(app)
					.delete(`routes/blogposts/${res.body[0].id}`);
			})
			.then(function(res){
				res.should.have.status(204);
			});
	});



})
