<a href="https://ajv-schema-generator.vercel.app/"><img src="https://ajv-schema-generator.vercel.app/view.png" /></a>

## 🚀 Install
```
    npm i ajv-schema-generator
```

## Using
```
    import { genSchema } from 'ajv-schema-generator'
    or 
    const { genSchema } = require('ajv-schema-generator')



    const js_object = {
      posts: [
        {
          id: 1,
          title: 'bar',
          author: 'foo'
        },
        {
          id: 2,
          title: 'ajv title'
        }
      ],
      comments: [
        {
          id: 1,
          body: 'some comment',
          postId: 1
        }
      ],
      profile: {
        name: 'typicode'
      }
    }
    
    const schema = genSchema(js_object)
    
    result: {
       "type":"object",
       "required":[
          "posts",
          "comments",
          "profile"
       ],
       "properties":{
          "posts":{
             "type":"array",
             "items":{
                "type":"object",
                "required":[
                   "id",
                   "title",
                   "author"
                ],
                "properties":{
                   "id":{
                      "type":"number"
                   },
                   "title":{
                      "type":"string"
                   },
                   "author":{
                      "type":"string"
                   }
                }
             }
          },
          "comments":{
             "type":"array",
             "items":{
                "type":"object",
                "required":[
                   "id",
                   "body",
                   "postId"
                ],
                "properties":{
                   "id":{
                      "type":"number"
                   },
                   "body":{
                      "type":"string"
                   },
                   "postId":{
                      "type":"number"
                   }
                }
             }
          },
          "profile":{
             "type":"object",
             "required":[
                "name"
             ],
             "properties":{
                "name":{
                   "type":"string"
                }
             }
          }
       }
    }
```
