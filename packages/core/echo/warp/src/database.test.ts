import { describe, test } from "@dxos/test";
import { EchoObject } from "./object";
import expect from 'expect'
import { ModelFactory } from "@dxos/model-factory";
import { ObjectModel } from "@dxos/object-model";
import { createInMemoryDatabase } from '@dxos/echo-db/testing'
import { EchoDatabase } from "./database";
import { sleep } from "@dxos/async";
import { OrderedArray } from "./ordered-array";

const createTestDb = async () => {
  const modelFactory = new ModelFactory().registerModel(ObjectModel);
  const database = await createInMemoryDatabase(modelFactory);
  return new EchoDatabase(database);
}

describe("EchoDatabase", () => {
  test('get/set properties', async () => {
    const warpDb = await createTestDb();

    const obj = new EchoObject();
    obj.title = 'Test title';
    warpDb.save(obj);
    obj.description = 'Test description';

    expect(obj.title).toEqual('Test title');
    expect(obj.description).toEqual('Test description');

    await sleep(10);

    expect(obj.title).toEqual('Test title');
    expect(obj.description).toEqual('Test description');
  })

  test('initializer', async () => {
    const warpDb = await createTestDb();

    const obj = new EchoObject({
      title: 'Test title',
      description: 'Test description'
    });
    warpDb.save(obj);

    expect(obj.title).toEqual('Test title');
    expect(obj.description).toEqual('Test description');

    await sleep(10);

    expect(obj.title).toEqual('Test title');
    expect(obj.description).toEqual('Test description');
  })

  test('object refs', async () => {
    const warpDb = await createTestDb();

    const task = new EchoObject({
      title: 'Fix bugs',
    });
    warpDb.save(task);
    const john = new EchoObject({
      name: 'John Doe',
    });
    task.assignee = john;

    expect(task.title).toEqual('Fix bugs');
    expect(task.assignee).toEqual(john);

    await sleep(10);

    expect(task.title).toEqual('Fix bugs');
    expect(task.assignee instanceof EchoObject).toBeTruthy();
    expect(task.assignee).toStrictEqual(john);
    expect(task.assignee.name).toEqual('John Doe');
  })

  test('nested props', async () => {
    const warpDb = await createTestDb();

    const task = new EchoObject({
      title: 'Fix bugs',
    });
    warpDb.save(task);
    await sleep(10);

    task.details = {
      priority: 'low',
    }
    task.details.deadline = '2021-01-01';
    expect(task.details.priority).toEqual('low');
    expect(task.details.deadline).toEqual('2021-01-01');
  });

  test('ordered arrays', async () => {
    const warpDb = await createTestDb();

    const task = new EchoObject({ title: 'Main task' });
    await warpDb.save(task);

    task.subtasks = new OrderedArray();
    task.subtasks.push(new EchoObject({ title: 'Subtask 1' }));
    task.subtasks.push(new EchoObject({ title: 'Subtask 2' }));
    task.subtasks.push(new EchoObject({ title: 'Subtask 3' }));

    expect(task.subtasks.length).toEqual(3);
    expect(task.subtasks[0].title).toEqual('Subtask 1');
    expect(task.subtasks[1].title).toEqual('Subtask 2');
    expect(task.subtasks[2].title).toEqual('Subtask 3');

    const titles = task.subtasks.map((subtask: EchoObject) => subtask.title);
    expect(titles).toEqual(['Subtask 1', 'Subtask 2', 'Subtask 3']);
  })
})