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

const Genrers = () => {

  const [isActive, setIsActive] = useState(true)
  const [genrers, setGenrers] = useState(false)
  const [show, setShow] = useState(false)
  const [genrer, setGenrer] = useState({})

  useEffect(() => {
    setIsActive(true)
    
    if (!genrers) {
      Http.get("genrers")
        .then(response => {
          setGenrers(response.data)
        })
        .catch(error => {
          console.log(error.response.data)
        })
    }
    
    if (genrers) {
      setIsActive(false)
    }
  }, [genrers])
  const handleClose = () => {
    setShow(false)
    setGenrer({})
  }
  const handleShow = (item = false) => {
    if (item) setGenrer(item)
    setShow(true)
  }
  const handleForm = event => {
    genrer[event.target.id] = event.target.value
    setGenrer({ ...genrer })
    console.log('genrer', genrer)
  }
  const deleteGenrer = (genrer = false) => {
    swal({
      title: "Você tem certeza?",
      text: "Esta açao não poderá ser desfeita",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(willDelete => {
      if (willDelete) {
        setIsActive(true)
        Http.delete(`genrers/${genrer.id}`)
          .then(response => {
            swal("Pronto, excluído com sucesso", {
              icon: "success",
            })
            setGenrers(false)
            setGenrer(false)
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
    if (typeof genrer.id === `undefined`) {
      service = Http.post("genrers", {
        ...genrer,
      })
    } else {
      service = Http.put(`genrers/${genrer.id}`, {
        ...genrer,
      })
    }
    service
      .then(response => {
        setShow(false)
        setGenrers(false)
        setGenrer({})
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
      <Layout pageInfo={{ pageName: "genrers" }}>
        <SEO title="Gêneros" keywords={[`UNYLEYA`, `teste`, `Gêneros`]} />
        <Container fluid>
          <Row>
            <Card className="col-12">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between">
                  <span>Gêneros</span>
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
                    {genrers &&
                      genrers.map(item => {
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
                                  onClick={() => deleteGenrer(item)}
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
                            value={genrer.name ?? ""}
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

export default Genrers
