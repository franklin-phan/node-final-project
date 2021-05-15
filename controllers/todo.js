const Todo = require('../models/Todo.js');
const User = require('../models/User.js');

module.exports = function(app) {

  app.get('/todos', (req, res) => {
    Todo.find({})
      .then(todos => {
        res.send(todos);
      })
      .catch(err => {
        res.status(400).send({error: err.message});
      });
  })

  app.post('/todo/new', (req, res) => {
    if (req.user) {
      const todo  = new Todo(req.body);
      todo.author = req.user._id;
      todo
        .save()
        .then(todo => {
          return User.findById(req.user._id);
        })
        .then(user => {
          user.todo.unshift(todo);
          user.save();
          res.send(todo);
        })
        .catch(err => {
          console.log(err.message);
          res.send({ error: err.message});
        });
    } else {
      return res.status(401);
    }
  });
  
  app.get("/todos/:id", (req, res) => {
    Todo.findById(req.params.id).lean()
      .populate('author')
      .then((todo) => {
        res.send(todo);
      })
      .catch(err => {
        console.log(err.message);
        res.send({ error: err.message});
      });
  });

  app.put("/todos/:id", (req, res) => {
    Todo.findById(req.params.id).lean()
      .populate('author')
      .then((todo) => {
        if (req.user != null && todo.author._id == req.user._id) {
          Todo.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(todo => {
              console.log('===========')
              console.log(todo)
              res.send(todo);
            })
            .catch(err => {
              console.log(err)
              res.status(400).send({error: err.message});
            });
        } else {
          res.status(400).send({error: "You can only update your todos."})
        }
      })
      .catch(err => {
        console.log(err.message);
        res.status(400).send({error: err.message});
      });
  });

  app.delete("/todos/:id", (req, res) => {
    Todo.findById(req.params.id)
      .then(todo => {
        if (todo.author._id == req.user._id) {
          todo.delete().then(() => {
            res.send({ success: `Successfully deleted the todo item ${req.params.id}`});
          }).catch(err => {
            res.send({ error: err.message });
          });
        } else {
          res.status(401).send({ error: 'You can only delete your own todo items'});
        }
      });
  });
};