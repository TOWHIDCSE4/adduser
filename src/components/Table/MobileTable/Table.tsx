import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { addQuery } from "@src/helpers/routes";
import {
  Pagination,
  Spin,
  Form,
  Typography,
  Button,
  Badge,
  Modal,
  Empty,
} from "antd";
import { FilterOutlined, CloseCircleOutlined } from "@ant-design/icons";
import _ from "lodash";
import { Base64 } from "js-base64";

import useBaseHook from "@src/hooks/BaseHook";
import CardComponent from "./Card";
import FilterInput from "../SearchComponents/Input";
const { Text } = Typography;
const getDataFromQuery = (query: any) => {
  let queryObj = query.filters || {};
  if (typeof query.filters == "string") {
    try {
      queryObj = JSON.parse(Base64.decode(query.filters));
    } catch (e) {
      throw new Error(`filters params invalid format.`);
    }
  }
  if (!queryObj) return {};
  let filters = queryObj.f || [];
  let sorting = queryObj.s || {};
  let queryOut = {
    filters: Array(),
    sorting: Array(),
    pageSize: queryObj.ps,
    page: queryObj.p,
  };
  for (let filter of filters) {
    queryOut.filters.push({
      field: filter[0],
      operator: filter[1],
      value: filter[2],
    });
  }

  for (let field in sorting) {
    queryOut.sorting.push({
      field: field,
      direction: sorting[field],
    });
  }

  return queryOut;
};

const makeQuery = (options: any) => {
  const { filters = [], sorting = [], pageSize, page } = options;
  let queryObj = {
    f: Array(),
    s: {} as any,
    ps: pageSize,
    p: page,
  };

  for (let filter of filters) {
    queryObj.f.push([
      filter.field,
      filter.operator || "contains",
      filter.value,
    ]);
  }
  for (let sort of sorting) {
    queryObj.s[sort.field] = sort.direction;
  }
  return Base64.encode(JSON.stringify(queryObj));
};

const checkHasFilter = (data: any = []) => {
  let result = data.filter((column: any) => column.filterable == true);
  return Boolean(result.length);
};

const MobileTable = (props: any) => {
  const { t, notify, redirect, setStore, getStore } = useBaseHook();
  const { getData } = useBaseHook();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [countFilter, setCountFilter] = useState(0);
  const [data, setData] = useState(getData(props, "data", []));
  const [pagination, setPagination] = useState(
    getData(props, "pagination", {})
  );
  const [_columns, setColumns] = useState(props.columns || []);
  const [total, setTotal] = useState(getData(props, "total", 0));

  const inititalProps = {
    size: "small",
    alignValue: "left",
  };

  // Biến toàn cục
  let _pagination: any = {}; // dùng ở build param vì k set kịp state
  let hasFilter = checkHasFilter(props.columns || []);

  /**
   * Khởi tạo các options từ query trên url
   */
  const init = () => {
    const query = router.query;
    const defaultOptions: any = getDataFromQuery(query);
    setCountFilter((defaultOptions.filters || []).length);
    _pagination = {
      pageSize: defaultOptions.pageSize || 50,
      page: defaultOptions.page || 0,
    };
    setPagination(_pagination);
    defaultOptionToColumns(defaultOptions);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    init();
  }, [router.query]);

  useEffect(() => {
    init();
    setData(getData(props, "data", []));
  }, [props.data]);

  /**
   * Convert lại dữ liệu từ query đổi sang đúng format của column trong antd
   */
  const defaultOptionToColumns = (defaultOptions: any) => {
    let result = _columns.map((column: any) => {
      //set field
      if (!column.field) column.field = column.key;

      let sort = defaultOptions.sorting.find(
        (item: any) => item.field === column.field
      );
      if (sort) {
        let { direction } = sort;
        column.sortOrder = direction === "asc" ? "ascend" : "descend";
      }
      let filters = defaultOptions.filters.filter(
        (item: any) => item.field === column.field
      );
      if (filters.length) {
        column.filteredValue = [...filters];
      } else {
        delete column.filteredValue;
      }
      return column;
    });
    setColumns(result);
  };

  /**
   * Build param query để khớp với format trên server
   */
  const buildFetchData = () => {
    let params = {
      filters: [] as any,
      sorting: [] as any,
      pageSize: _pagination.pageSize,
      page: _pagination.page,
    };
    _columns.map((column: any) => {
      if (column.filteredValue) {
        params.filters = [...params.filters, ...column.filteredValue];
      }
      if (column.sortOrder) {
        params.sorting.push({
          field: column.field,
          direction: column.sortOrder == "ascend" ? "asc" : "desc",
        });
      }
    });
    return params;
  };

  /**
   * Reload Table
   */
  const reload = async () => {
    setLoading(true);
    if (typeof props.fetchData === "function") {
      const params = buildFetchData();
      const queryOptions = makeQuery(params);
      addQuery({ filters: queryOptions }); //thêm vào router.query

      let result = (await props.fetchData(params)) || {};
      if (result.total != undefined) setTotal(result.total);
      setData([..._.get(result, "data", [])]);
    }
    setLoading(false);
  };

  /**
   * Set pagination
   */
  const onChangePagination = async (page: number, pageSize?: number) => {
    _pagination = {
      pageSize: pageSize,
      page: page - 1,
    };
    await setPagination(_pagination);
    reload();
  };

  const onShowSizeChange = async (current: number, size: number) => {
    _pagination = {
      pageSize: size,
      page: current - 1,
    };
    await setPagination(_pagination);
    reload();
  };

  const getPagination: any = () => {
    const { pageSize, page } = pagination;
    return {
      total: total,
      position: "bottom",
      pageSize: pageSize || 50,
      current: page + 1,
      size: "small",
      showSizeChanger: true,
      pageSizeOptions: ["2", "10", "50", "100", "200", "500"],
      showTotal: () => `Tổng ${total} bản ghi`,
    };
  };

  const setFiltersToColumns = (filters = [], currentField: string) => {
    let filter: any = filters[0];
    let result = _columns.map((column: any) => {
      if (filter && column.field === filter.field) {
        column.filteredValue = [...filters];
      } else if (!filter && column.field === currentField) {
        delete column.filteredValue;
      }
      return column;
    });
    setColumns(result);
    reload();
  };

  const resetFilter = () => {
    form.resetFields();
    let result = _columns.map((column: any) => {
      delete column.filteredValue;
      return column;
    });
    setColumns(result);
    reload();
  };

  const renderFilterList = () => {
    return (
      <div>
        <div>
          <Text> Lọc các bản ghi:</Text>
          <Button size="small" onClick={resetFilter} style={{ float: "right" }}>
            <CloseCircleOutlined /> Bỏ lọc
          </Button>
          <span style={{ float: "right", marginRight: "16px" }}>
            <Badge count={countFilter}>
              <Button
                size="small"
                onClick={() => setVisible(true)}
                type="primary"
              >
                <FilterOutlined /> Lọc
              </Button>
            </Badge>
          </span>
        </div>
        <br />

        <Modal
          closable={true}
          visible={visible}
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <Form form={form} initialValues={{}} layout="vertical">
            {_columns.map((column: any) => {
              let ref = React.useRef(null);
              if (!column.filterable) return;
              if (column.renderFilter) {
                return (
                  <Form.Item
                    label={column.title}
                    name={column.dataIndex}
                    key={column.key}
                  >
                    {column.renderFilter({
                      column,
                      confirm: (filters: []) =>
                        setFiltersToColumns(filters, column.field),
                      ref,
                    })}
                  </Form.Item>
                );
              }
              return (
                <Form.Item
                  label={column.title}
                  name={column.dataIndex}
                  key={column.key}
                >
                  <FilterInput
                    column={column}
                    ref={ref}
                    confirm={(filters: []) =>
                      setFiltersToColumns(filters, column.field)
                    }
                  />
                </Form.Item>
              );
            })}
          </Form>
        </Modal>
      </div>
    );
  };

  const renderCardList = () => {
    let {
      columns = [],
      pagination = {},
      total,
      fetchData,
      rowSelection,
      ...otherProps
    } = props;
    return (
      <div>
        <Spin spinning={loading}>
          <div>
            {data.length ? (
              data.map((item: any, index: any) => (
                <CardComponent
                  key={index}
                  record={item}
                  columns={columns}
                  {...inititalProps}
                  {...otherProps}
                />
              ))
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
          </div>
        </Spin>
        <div style={{ textAlign: "right" }}>
          <Pagination
            {...getPagination()}
            onChange={onChangePagination}
            onShowSizeChange={onShowSizeChange}
            style={pagination === false ? { display: "none" } : {}}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      {hasFilter ? renderFilterList() : ""}
      {renderCardList()}
    </div>
  );
};
export default MobileTable;
