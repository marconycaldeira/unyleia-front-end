import React, { useState, useEffect } from "react"
import {
  Row,
  Table,
  Container,
  Card,
  Button,
  Modal,
  Form,
  ButtonGroup,
} from "react-bootstrap"
import Layout from "../components/layout"
import Http from "../services/http"
import SEO from "../components/seo"
import LoadingOverlay from "react-loading-overlay"
import swal from "sweetalert"

const Publishers = () => {

  const [isActive, setIsActive] = useState(true)
  const [publishers, setPublishers] = useState(false)
  const [show, setShow] = useState(false)
  const [publisher, setPublicher] = useState({})

  useEffect(() => {
    setIsActive(true)
    
    if (!publishers) {
      Http.get("publishers")
        .then(response => {
          setPublishers(response.data)
        })
        .catch(error => {
          console.log(error.response.data)
        })
    }
    
    if (publishers) {
      setIsActive(false)
    }
  }, [publishers])
  const handleClose = () => {
    setShow(false)
    setPublicher({})
  }
  const handleShow = (item = false) => {
    if (item) setPublicher(item)
    setShow(true)
  }
  const handleForm = event => {
    publisher[event.target.id] = event.target.value
    setPublicher({ ...publisher })
    console.log(publisher)
  }
  const deletePublicher = (publisher = false) => {
    swal({
      title: "Você tem certeza?",
      text: "Esta açao não poderá ser desfeita",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(willDelete => {
      if (willDelete) {
        setIsActive(true)
        Http.delete(`publishers/${publisher.id}`)
          .then(response => {
            swal("Pronto, excluído com sucesso", {
              icon: "success",
            })
            setPublishers(false)
            setPublicher(false)
          })
          .catch(error => {
            swal("Erro ao deletar", error.response.data, "warning")
            console.log(error.response.data)
          })
          .then(() => {
            setIsActive(false)
          })
      } else {
        swal("Tudo bem então")
      }
    })
  }

  const save = () => {
    setIsActive(true)
    let service
    if (typeof publisher.id === `undefined`) {
      service = Http.post("publishers", {
        ...publisher,
      })
    } else {
      service = Http.put(`publishers/${publisher.id}`, {
        ...publisher,
      })
    }
    service
      .then(response => {
        setShow(false)
        setPublishers(false)
        setPublicher({})
      })
      .catch(error => {
        setIsActive(false)
        if (typeof error.response.data.errors !== "undefined") {
          for (const key in error.response.data.errors) {
            if (error.response.data.errors.hasOwnProperty(key)) {
              const element = error.response.data.errors[key]
              console.log(element[0])
              swal("Houve um erro ao salvar", element[0], "warning")
            }
          }
        } else {
          swal(
            "Ops...",
            "Houve um erro desconhecido ao tentar salvar",
            "warning"
          )
        }
      })
  }
  return (
    <LoadingOverlay active={isActive} spinner text="Carregando, aguarde...">
      <Layout pageInfo={{ pageName: "publishers" }}>
        <SEO title="Editoras" keywords={[`UNYLEYA`, `teste`, `Editoras`]} />
        <Container fluid>
          <Row>
            <Card className="col-12">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between">
                  <span>Editoras</span>
                  <Button onClick={() => handleShow()} variant="success">
                    Cadastrar
                  </Button>{" "}
                </Card.Title>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nome</th>
                     
                      <th>Opçôes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publishers &&
                      publishers.map(item => {
                        return (
                          <tr>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                           
                            <td>
                              <ButtonGroup aria-label="Basic example">
                                <Button
                                  onClick={() => handleShow(item)}
                                  variant="warning"
                                >
                                  Editar
                                </Button>
                                <Button
                                  onClick={() => deletePublicher(item)}
                                  variant="danger"
                                >
                                  Excluir
                                </Button>
                              </ButtonGroup>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </Table>
                <Modal show={show} centered onHide={handleClose}>
                  <LoadingOverlay
                    active={isActive}
                    spinner
                    text="Carregando, aguarde..."
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Dados cadastrais da editora</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group controlId="name">
                          <Form.Label>Nome da editora</Form.Label>
                          <Form.Control
                            type="text"
                            value={publisher.name ?? ""}
                            onChange={handleForm}
                            placeholder="Nome da editora"
                          />
                        </Form.Group>
                       
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Fechar
                      </Button>
                      <Button variant="primary" onClick={save}>
                        Salvar editora
                      </Button>
                    </Modal.Footer>
                  </LoadingOverlay>
                </Modal>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </Layout>
    </LoadingOverlay>
  )
}

export default Publishers
