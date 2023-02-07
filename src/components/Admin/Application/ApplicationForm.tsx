import {
  AlignCenterOutlined,
  ArrowRightOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import useBaseHooks from "@root/src/hooks/BaseHook";
import useStatusCount from "@root/src/hooks/StatusCount";
import documentTemplateService from "@root/src/services/documentTemplateService";
import {
  Button,
  Card,
  Col,
  Input,
  Pagination,
  Row,
  Skeleton,
  Space,
  Statistic,
} from "antd";
import Meta from "antd/lib/card/Meta";
import to from "await-to-js";
import { useEffect, useState } from "react";

const { Search } = Input;

const ApplicationForm = () => {
  const { t, redirect, notify } = useBaseHooks();
  const status = useStatusCount();
  const [documentTemplateFrom, setDocumentTemplateFrom] = useState(null);
  const [currentpage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const onInputChange = async (e) => {
    e.preventDefault();
    await onSearch(e.target.value);
  };
  const onSearch = async (value: string) => {
    setLoading(true);
    setDocumentTemplateFrom(null);

    const values: any = {};

    values.sorting = [{ field: "document_templates.id", direction: "desc" }];

    values.filters = [
      {
        field: "document_templates.name",
        operator: "contains",
        value: value,
      },
    ];

    values.pageSize = 4;

    let [error, documentTemplateFromObject]: [any, any] = await to(
      documentTemplateService().withAuth().index(values)
    );

    if (error) return notify(t(`errors:${error.code}`), "", "error");
    setDocumentTemplateFrom(documentTemplateFromObject?.data);
    setTotal(parseInt(documentTemplateFromObject.total));
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  /**
   * page change on pagination
   * @params {page,pageSize}
   * @returns
   */

  const onPageChange = async (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const fetchData = async () => {
    const values: any = {};
    values.page = currentpage === 0 ? currentpage : currentpage - 1;
    values.pageSize = pageSize;
    
    values.sorting = [{ field: "document_templates.id", direction: "desc" }];

    let [error, documentTemplateFromObject]: [any, any] = await to(
      documentTemplateService().withAuth().index(values)
    );

    if (error) return notify(t(`errors:${error.code}`), "", "error");
    setDocumentTemplateFrom(documentTemplateFromObject?.data);
    setTotal(parseInt(documentTemplateFromObject.total));
    
  };


  useEffect(() => {
    fetchData();
  }, [currentpage]);

  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Card
            type="inner"
            title="Form List"
            onClick={() => redirect("frontend.admin.documents.index")}
            extra={<a>{t("pages:application.applicationForm.view")}</a>}
          >
            <Row>
              <Col span={6}>
                <Statistic
                  title={t("pages:application.applicationForm.submitted")}
                  value={status["Submitted"]}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={t("pages:application.applicationForm.approve")}
                  value={status["Approve"]}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={t("pages:application.applicationForm.inReview")}
                  value={status["To Be Reviewed"]}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={t("pages:application.applicationForm.rejected")}
                  value={status["Rejected"]}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            type="inner"
            title="Form Draft"
            onClick={() => redirect("frontend.admin.documents.draft")}
            extra={<a>{t("pages:application.applicationForm.view")}</a>}
          >
            <Statistic
              title={t("pages:application.applicationForm.draft")}
              value={status["Draft"]}
            />
          </Card>
        </Col>
      </Row>
      <br />
      <Card type="inner">
        <Space>
          <Button>
            <AlignCenterOutlined /> More Filter
          </Button>
          <Button
            type="primary"
            onClick={() => redirect("frontend.admin.documentTemplates.create")}
          >
            <PlusCircleOutlined /> Create Document Templates
          </Button>
        </Space>
        <Search
          placeholder="Search"
          className="btn-right"
          onSearch={onSearch}
          onChange={onInputChange}
          style={{ width: 300 }}
        />
      </Card>
      <Card>
        {loading ? (
          <Skeleton />
        ) : (
          <Row gutter={8} style={{ gap: "20px" }}>
            {documentTemplateFrom?.map((documentTemplate: any) => {
              return (
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="anh-nen"
                      src="https://img.freepik.com/free-vector/vibrant-summer-ombre-background-vector_53876-105765.jpg?w=2000"
                    />
                  }
                >
                  <Meta
                    title={documentTemplate?.name}
                    description={documentTemplate?.description}
                  />
                  <br />
                  <Button
                    type="primary"
                    onClick={() => {
                      localStorage.setItem(
                        "template",
                        JSON.stringify(documentTemplate)
                      );
                      redirect("frontend.admin.application.create");
                    }}
                  >
                    {t("pages:application.applicationForm.apply")}{" "}
                    <ArrowRightOutlined />
                  </Button>
                </Card>
              );
            })}
          </Row>
        )}
      </Card>
      <br />

      <div className="text-center">
        {loading ? (
          <Skeleton.Button />
        ) : (
          <Pagination
            total={total}
            defaultCurrent={1}
            pageSize={pageSize}
            current={currentpage}
            onChange={onPageChange}
          />
        )}
      </div>
    </>
  );
};

export default ApplicationForm;