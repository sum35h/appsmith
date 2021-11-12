import { DataTree, ENTITY_TYPE } from "entities/DataTree/dataTreeFactory";
import { PluginType } from "entities/Action";
import { createGlobalData } from "workers/evaluate";

describe("Add functions", () => {
  jest.resetAllMocks();
  const workerEventMock = jest.fn();
  self.postMessage = workerEventMock;
  self.ALLOW_ASYNC = true;
  const dataTree: DataTree = {
    action1: {
      actionId: "123",
      data: {},
      config: {},
      pluginType: PluginType.API,
      dynamicBindingPathList: [],
      name: "action1",
      bindingPaths: {},
      isLoading: false,
      run: {},
      clear: {},
      responseMeta: { isExecutionSuccess: false },
      ENTITY_TYPE: ENTITY_TYPE.ACTION,
      dependencyMap: {},
      logBlackList: {},
    },
  };
  const dataTreeWithFunctions = createGlobalData(dataTree, {});
  self.REQUEST_ID = "EVAL_TRIGGER";

  beforeEach(() => {
    workerEventMock.mockReset();
    self.postMessage = workerEventMock;
  });

  it("action.run works", () => {
    // Action run
    const onSuccess = () => "success";
    const onError = () => "failure";
    const actionParams = { param1: "value1" };

    workerEventMock.mockReturnValue({
      data: {
        method: "PROCESS_TRIGGER",
        requestId: "EVAL_TRIGGER",
        success: true,
        data: {
          a: "b",
        },
      },
    });

    // Old syntax works
    expect(
      dataTreeWithFunctions.action1.run(onSuccess, onError, actionParams),
    ).resolves.toBe({ a: "b" });
    expect(workerEventMock).lastCalledWith({
      type: "PROCESS_TRIGGER",
      requestId: "EVAL_TRIGGER",
      responseData: {
        errors: [],
        subRequestId: expect.stringContaining("EVAL_TRIGGER_"),
        trigger: {
          type: "RUN_PLUGIN_ACTION",
          payload: {
            actionId: "123",
            params: { param1: "value1" },
          },
        },
      },
    });

    // new syntax works
    expect(
      dataTreeWithFunctions.action1
        .run(actionParams)
        .then(onSuccess)
        .catch(onError),
    ).resolves.toBe({ a: "b" });
    expect(workerEventMock).lastCalledWith({
      type: "PROCESS_TRIGGER",
      requestId: "EVAL_TRIGGER",
      responseData: {
        errors: [],
        subRequestId: expect.stringContaining("EVAL_TRIGGER_"),
        trigger: {
          type: "RUN_PLUGIN_ACTION",
          payload: {
            actionId: "123",
            params: { param1: "value1" },
          },
        },
      },
    });
    // New syntax without params
    expect(dataTreeWithFunctions.action1.run()).resolves.toBe({ a: "b" });

    expect(workerEventMock).lastCalledWith({
      type: "PROCESS_TRIGGER",
      requestId: "EVAL_TRIGGER",
      responseData: {
        errors: [],
        subRequestId: expect.stringContaining("EVAL_TRIGGER_"),
        trigger: {
          type: "RUN_PLUGIN_ACTION",
          payload: {
            actionId: "123",
            params: {},
          },
        },
      },
    });
  });

  it("action.clear works", () => {
    expect(dataTreeWithFunctions.action1.clear()).resolves.toBe({});
    expect(workerEventMock).lastCalledWith({
      type: "PROCESS_TRIGGER",
      requestId: "EVAL_TRIGGER",
      responseData: {
        errors: [],
        subRequestId: expect.stringContaining("EVAL_TRIGGER_"),
        trigger: {
          type: "CLEAR_PLUGIN_ACTION",
          payload: {
            actionId: "123",
          },
        },
      },
    });
  });

  it("navigateTo works", () => {
    const pageNameOrUrl = "www.google.com";
    const params = "{ param1: value1 }";
    const target = "NEW_WINDOW";

    expect(
      dataTreeWithFunctions.navigateTo(pageNameOrUrl, params, target),
    ).resolves.toBe({});

    expect(workerEventMock).lastCalledWith({
      type: "PROCESS_TRIGGER",
      requestId: "EVAL_TRIGGER",
      responseData: {
        errors: [],
        subRequestId: expect.stringContaining("EVAL_TRIGGER_"),
        trigger: {
          type: "NAVIGATE_TO",
          payload: {
            pageNameOrUrl,
            params,
            target,
          },
        },
      },
    });
  });

  it("showAlert works", () => {
    const message = "Alert message";
    const style = "info";
    expect(dataTreeWithFunctions.showAlert(message, style)).resolves.toBe({});
    expect(workerEventMock).lastCalledWith({
      type: "PROCESS_TRIGGER",
      requestId: "EVAL_TRIGGER",
      responseData: {
        errors: [],
        subRequestId: expect.stringContaining("EVAL_TRIGGER_"),
        trigger: {
          type: "SHOW_ALERT",
          payload: {
            message,
            style,
          },
        },
      },
    });
  });

  it("showModal works", () => {
    const modalName = "Modal 1";

    expect(dataTreeWithFunctions.showModal(modalName)).resolves.toBe({});
    expect(workerEventMock).lastCalledWith({
      type: "PROCESS_TRIGGER",
      requestId: "EVAL_TRIGGER",
      responseData: {
        errors: [],
        subRequestId: expect.stringContaining("EVAL_TRIGGER_"),
        trigger: {
          type: "SHOW_MODAL_BY_NAME",
          payload: {
            modalName,
          },
        },
      },
    });
  });

  it("closeModal works", () => {
    const modalName = "Modal 1";
    expect(dataTreeWithFunctions.closeModal(modalName)).resolves.toBe({});
    expect(workerEventMock).lastCalledWith({
      type: "PROCESS_TRIGGER",
      requestId: "EVAL_TRIGGER",
      responseData: {
        errors: [],
        subRequestId: expect.stringContaining("EVAL_TRIGGER_"),
        trigger: {
          type: "CLOSE_MODAL",
          payload: {
            modalName,
          },
        },
      },
    });
  });

  it("storeValue works", () => {
    const key = "some";
    const value = "thing";
    const persist = false;

    expect(dataTreeWithFunctions.storeValue(key, value, persist)).resolves.toBe(
      {},
    );
    expect(workerEventMock).lastCalledWith({
      type: "PROCESS_TRIGGER",
      requestId: "EVAL_TRIGGER",
      responseData: {
        errors: [],
        subRequestId: expect.stringContaining("EVAL_TRIGGER_"),
        trigger: {
          type: "STORE_VALUE",
          payload: {
            key,
            value,
            persist,
          },
        },
      },
    });
  });

  it("download works", () => {
    const data = "file";
    const name = "downloadedFile.txt";
    const type = "text";

    expect(dataTreeWithFunctions.download(data, name, type)).resolves.toBe({});
    expect(workerEventMock).lastCalledWith({
      type: "PROCESS_TRIGGER",
      requestId: "EVAL_TRIGGER",
      responseData: {
        errors: [],
        subRequestId: expect.stringContaining("EVAL_TRIGGER_"),
        trigger: {
          type: "DOWNLOAD",
          payload: {
            data,
            name,
            type,
          },
        },
      },
    });
  });

  it("copyToClipboard works", () => {
    const data = "file";
    expect(dataTreeWithFunctions.copyToClipboard(data)).resolves.toBe({});
    expect(workerEventMock).lastCalledWith({
      type: "PROCESS_TRIGGER",
      requestId: "EVAL_TRIGGER",
      responseData: {
        errors: [],
        subRequestId: expect.stringContaining("EVAL_TRIGGER_"),
        trigger: {
          type: "COPY_TO_CLIPBOARD",
          payload: {
            data,
            options: { debug: undefined, format: undefined },
          },
        },
      },
    });
  });

  it("resetWidget works", () => {
    const widgetName = "widget1";
    const resetChildren = true;

    expect(
      dataTreeWithFunctions.resetWidget(widgetName, resetChildren),
    ).resolves.toBe({});
    expect(workerEventMock).lastCalledWith({
      type: "PROCESS_TRIGGER",
      requestId: "EVAL_TRIGGER",
      responseData: {
        errors: [],
        subRequestId: expect.stringContaining("EVAL_TRIGGER_"),
        trigger: {
          type: "RESET_WIDGET_META_RECURSIVE_BY_NAME",
          payload: {
            widgetName,
            resetChildren,
          },
        },
      },
    });
  });

  it("setInterval works", () => {
    const callback = () => "test";
    const interval = 5000;
    const id = "myInterval";

    expect(
      dataTreeWithFunctions.setInterval(callback, interval, id),
    ).resolves.toBe({});
    expect(workerEventMock).lastCalledWith({
      type: "PROCESS_TRIGGER",
      requestId: "EVAL_TRIGGER",
      responseData: {
        errors: [],
        subRequestId: expect.stringContaining("EVAL_TRIGGER_"),
        trigger: {
          type: "SET_INTERVAL",
          payload: {
            callback: '() => "test"',
            interval,
            id,
          },
        },
      },
    });
  });

  it("clearInterval works", () => {
    const id = "myInterval";

    expect(dataTreeWithFunctions.clearInterval(id)).resolves.toBe({});
    expect(workerEventMock).lastCalledWith({
      type: "PROCESS_TRIGGER",
      requestId: "EVAL_TRIGGER",
      responseData: {
        errors: [],
        subRequestId: expect.stringContaining("EVAL_TRIGGER_"),
        trigger: {
          type: "CLEAR_INTERVAL",
          payload: {
            id,
          },
        },
      },
    });
  });
});

describe("promise execution", () => {
  const postMessageMock = jest.fn();
  const requestId = "TEST_REQUEST";
  const dataTreeWithFunctions = createGlobalData({}, {});

  beforeEach(() => {
    self.ALLOW_ASYNC = true;
    self.REQUEST_ID = requestId;
    self.postMessage = postMessageMock;
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("throws when allow async is not enabled", () => {
    self.ALLOW_ASYNC = false;
    self.IS_ASYNC = false;
    expect(dataTreeWithFunctions.showAlert).toThrowError();
    expect(self.IS_ASYNC).toBe(true);
    expect(postMessageMock).not.toHaveBeenCalled();
  });
  it("sends an event from the worker", () => {
    dataTreeWithFunctions.showAlert("test alert", "info");
    const requestArgs = postMessageMock.mock.calls[0][0];
    const subRequestId = requestArgs.responseData.subRequestId;
    expect(postMessageMock).toBeCalledWith({
      requestId,
      type: "PROCESS_TRIGGER",
      responseData: expect.objectContaining({
        subRequestId: expect.stringContaining(`${requestId}_`),
        trigger: {
          type: "SHOW_ALERT",
          payload: {
            message: "test alert",
            style: "info",
          },
        },
      }),
    });
    self.addEventListener = jest
      .fn()
      .mockImplementationOnce((type, handler) => {
        handler({ data: { data: { success: true, subRequestId } } });
      });
  });
  // it("returns a promise that resolves", () => {
  //   postMessageMock.mockReset();
  //   const returnedPromise = dataTreeWithFunctions.showAlert(
  //     "test alert",
  //     "info",
  //   );
  //   const requestArgs = postMessageMock.mock.calls[0][0];
  //   const subRequestId = requestArgs.responseData.subRequestId;
  //
  //   jest
  //     .spyOn(self, "addEventListener")
  //     .mockImplementationOnce((event, handler) => {
  //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //       // @ts-ignore
  //       const gen = handler({
  //         data: {
  //           method: "PROCESS_TRIGGER",
  //           data: {
  //             resolve: "123",
  //           },
  //           requestId,
  //           success: true,
  //           subRequestId,
  //         },
  //       });
  //       gen.next();
  //     });
  //
  //   expect(returnedPromise).resolves.toBe("123");
  // });
  //
  // it("returns a promise that rejects", () => {
  //   postMessageMock.mockReset();
  //   const returnedPromise = dataTreeWithFunctions.showAlert(
  //     "test alert",
  //     "info",
  //   );
  //   const requestArgs = postMessageMock.mock.calls[0][0];
  //   const subRequestId = requestArgs.responseData.subRequestId;
  //
  //   jest
  //     .spyOn(self, "addEventListener")
  //     .mockImplementationOnce((event, handler) => {
  //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //       // @ts-ignore
  //       const gen = handler({
  //         data: {
  //           method: "PROCESS_TRIGGER",
  //           data: {
  //             reason: "testing",
  //           },
  //           requestId,
  //           success: false,
  //           subRequestId,
  //         },
  //       });
  //       gen.next();
  //     });
  //
  //   expect(returnedPromise).rejects.toBe("testing");
  // });
  // it("does not process till right event is triggered", () => {
  //   jest.resetAllMocks();
  //
  //   const returnedPromise = dataTreeWithFunctions.showAlert(
  //     "test alert",
  //     "info",
  //   );
  //
  //   const requestArgs = postMessageMock.mock.calls[0][0];
  //   const subRequestId = requestArgs.responseData.subRequestId;
  //   jest
  //     .spyOn(self, "addEventListener")
  //     .mockImplementationOnce((event, handler) => {
  //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //       // @ts-ignore
  //       const gen = handler({
  //         data: {
  //           method: "PROCESS_TRIGGER",
  //           data: {
  //             resolve: "wrong value",
  //           },
  //           requestId,
  //           success: false,
  //           subRequestId: "wrongId",
  //         },
  //       });
  //       gen.next();
  //     });
  //   // .mockImplementationOnce((event, handler) => {
  //   //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   //   // @ts-ignore
  //   //   const gen2 = handler({
  //   //     data: {
  //   //       method: "PROCESS_TRIGGER",
  //   //       data: {
  //   //         resolve: "right value",
  //   //       },
  //   //       requestId,
  //   //       success: true,
  //   //       subRequestId,
  //   //     },
  //   //   });
  //   //   gen2.next();
  //   // });
  //
  //   // expect(laterFunction).not.toHaveBeenCalledWith("wrong value");
  //   expect(returnedPromise).resolves.toBe("bullshit");
  //   // expect(laterFunction).toHaveBeenCalledWith("right value");
  // });
  // // it("same subRequestId is not accepted again", () => {});
});
