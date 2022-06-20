import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {context, getOctokit} from '@actions/github'
import * as glob from '@actions/glob'
import * as io from '@actions/io'
import {callAsyncFunction} from './async-function'
import {wrapRequire} from './wrap-require'

process.on('unhandledRejection', handleError)
main().then(success).catch(handleError)

type Options = {
  log?: Console
  userAgent?: string
  previews?: string[]
}

async function main() {
  const token = core.getInput('github-token', {required: true})
  const debug = core.getInput('debug')
  const userAgent = core.getInput('user-agent')
  const previews = core.getInput('previews')

  const opts: Options = {}
  if (debug === 'true') opts.log = console
  if (userAgent != null) opts.userAgent = userAgent
  if (previews != null) opts.previews = previews.split(',')

  const github = getOctokit(token, opts)
  let actions = core.getInput('actions') 
  const result = await github.rest.actions.createWorkflowDispatch({
    owner: 'echoiitime-inc',
    repo: 'hello-world-javascript-action',
    workflow_id: 'node_test.yml',
    ref: 'master'
  })
  
  

  // Using property/value shorthand on `require` (e.g. `{require}`) causes compilation errors.
  // const result = await callAsyncFunction(
  //   {
  //     require: wrapRequire,
  //     __original_require__: __non_webpack_require__,
  //     github,
  //     context,
  //     core,
  //     exec,
  //     glob,
  //     io
  //   },
  //   `return  await github.rest.actions.createWorkflowDispatch({
  //     owner: 'echoiitime-inc',
  //     repo: 'hello-world-javascript-action',
  //     workflow_id: 'node_test.yml',
  //     ref: 'master'
  //   })`
  // )
  console.log('result', result);
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(err: any): void {
  console.error(err)
  core.setOutput('result', false)
  core.setFailed(`Unhandled error: ${err}`)
}

function success( data: any): void {
  console.log('result', data);
  core.setOutput('result', data)
}