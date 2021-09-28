import { compare_file_path, OrchidFilePath } from "../orchid_file_path";

test("Check folder parent", () => {
    const base_path: OrchidFilePath = {
        Folder: {
            folder_name: "bee",
            child: {
                OrchidModule: {
                    folder_name: "big_yum",
                    formatted_name: "Big yum",
                    child: {
                        File: {
                            file_name: "juice.orch",
                            formatted_name: "Juice",
                        },
                    },
                },
            },
        },
    };

    const cmp_path: OrchidFilePath = {
        Folder: {
            folder_name: "bee",
            child: {
                OrchidModule: {
                    folder_name: "big_yum",
                    formatted_name: "Big yum",
                    child: null,
                },
            },
        },
    };

    const cmp = compare_file_path(base_path, cmp_path);

    expect(cmp.is_parent).toBe(true);
    expect(cmp.is_equal).toBe(false);
});

test("Check equal paths", () => {
    const base_path: OrchidFilePath = {
        Folder: {
            folder_name: "bee",
            child: {
                OrchidModule: {
                    folder_name: "big_yum",
                    formatted_name: "Big yum",
                    child: {
                        File: {
                            file_name: "juice.orch",
                            formatted_name: "Juice",
                        },
                    },
                },
            },
        },
    };

    const cmp_path: OrchidFilePath = {
        Folder: {
            folder_name: "bee",
            child: {
                OrchidModule: {
                    folder_name: "big_yum",
                    formatted_name: "Big yum",
                    child: {
                        File: {
                            file_name: "juice.orch",
                            formatted_name: "Juice",
                        },
                    },
                },
            },
        },
    };

    const cmp = compare_file_path(base_path, cmp_path);

    expect(cmp.is_parent).toBe(false);
    expect(cmp.is_equal).toBe(true);
});

test("Check unequal paths", () => {
    const base_path: OrchidFilePath = {
        Folder: {
            folder_name: "bee",
            child: {
                OrchidModule: {
                    folder_name: "big_yum",
                    formatted_name: "Big yum",
                    child: {
                        File: {
                            file_name: "juice.orch",
                            formatted_name: "Juice",
                        },
                    },
                },
            },
        },
    };

    const cmp_path: OrchidFilePath = {
        Folder: {
            folder_name: "bee",
            child: {
                OrchidModule: {
                    folder_name: "big_tum",
                    formatted_name: "Big yum",
                    child: {
                        File: {
                            file_name: "juice.orch",
                            formatted_name: "Juice",
                        },
                    },
                },
            },
        },
    };

    const cmp = compare_file_path(base_path, cmp_path);

    expect(cmp.is_parent).toBe(false);
    expect(cmp.is_equal).toBe(false);
});
