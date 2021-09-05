const express = require('express'); 
const {buildSchema} = require('graphql'); 
const {graphqlHTTP} = require('express-graphql'); 
const crypto = require('crypto'); 

const db = {
    users: [
        {id: '1', name: 'Gideon', email:'gideon@gmail.com', avatarUrl:'http://graphatar.com/...'}, 
        {id: '2', name: 'Nombulelo', email: 'nombulelo@gmail.com', avatarUrl:'http://graphatar.com/...'}
    ], 
    messages: [
      {id: '1', userId: '1', body: 'Hello', createdAt: Date.now()}, 
      {id: '2', userId: '2', body: 'Hi', createdAt: Date.now()},
      {id:  '3', userId: '1', body: 'what\s up', createdAt: Date.now()}
    ]
}

class User {
    constructor(user){
        Object.assign(this,user)
    }
    messages () {
        return db.messages.filter(message => message.userId === this.id)
    }
}

const schema = buildSchema(`
  type Query {
      listUsers: [User!]!
      listuser(id: ID!): User
      messages: [Message!]!
  }

  type Mutation{
      addUser(email:String!, name: String): User
  }
  type User {
      id: ID!
      name: String
      email: String
      avatarUrl: String
      messages: [Message!]!
  }
  type Message {
      id: ID!
      body: String, 
      createdAt: String 
  }

`)

const rootValue = {
    listUsers: () => db.users.map(user => new User(user)),
    messages : () =>  db.messages, 
    listuser: args => db.users.find(user => user.id === args.id),
    addUser: ({email, name}) => {
        const user = {
            id: crypto.randomBytes(10).toString('hex'), 
            email,
            name
        }
        db.users.push(user); 
        return user; 
    }

   
}

const app = express(); 
app.use('/graphql', graphqlHTTP({
    schema, 
    rootValue, 
    graphiql: true
}))


app.listen(3000, function(){
    console.log('app running on port 3000'); 
})