import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { setOfTodos } from '../../businessLogic/todos'


const logger = createLogger('getTodos')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info("A get all request received:", event)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const limit = getQueryParameter(event, 'limit')
  const nextKey = getQueryParameter(event, 'nextKey')
  //happy case when limit exists, should return a list of items & a nextKey
  if (nextKey != undefined) {
    const todos = await setOfTodos(jwtToken, limit, nextKey)
    logger.info("Todos received from database", { todos })
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(todos)
    }
  }
  else {
    const todos = await setOfTodos(jwtToken, limit)
    logger.info("Todos received from database", { todos })
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(todos)
    }
  }
}
  

  /*try {
    const Todos = await setOfTodos(jwtToken)
    logger.info("Todos received from database", { Todos })
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: Todos
      })
    }
  } catch (e) {
    logger.error('Something went wrong')
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({"message": 'Oops something went wrong'})
    } 
  }*/




const getQueryParameter = (event, parameter) => {
  if(!event.queryStringParameters[parameter]){
  
    return undefined

  } else {
    const result = event.queryStringParameters[parameter]
    return result
  }

}