import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { context, getOctokit } from '@actions/github'
import * as glob from '@actions/glob'
import * as io from '@actions/io'
import {callAsyncFunction} from './async-function'
import {wrapRequire} from './wrap-require'

process.on('unhandledRejection', handleError)


type Options = {
  log?: Console
  userAgent?: string
  previews?: string[]
}

async function main() {
  const token = core.getInput('github-token', {required: true})
  const opts: Options = {}
  const github = getOctokit(token, opts)
  const result = await github.rest.actions.createWorkflowDispatch({
    owner: 'echoiitime-inc',
    repo: 'hello-world-javascript-action',
    workflow_id: 'node_test.yml',
    ref: 'master'
  });
  console.log("run_id", context.runId);
  console.log('result', result);
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(err: any): void {
  console.error(err)
  core.setOutput('result', false)
  core.setFailed(`Unhandled error: ${err}`)
}

try {
  const result = await main();
  core.setOutput('result', result)
} catch (err) {
  handleError(err);
}