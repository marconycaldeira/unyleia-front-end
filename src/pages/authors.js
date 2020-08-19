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

const Authors = () => {

  const [isActive, setIsActive] = useState(true)
  const [authors, setAuthors] = useState(false)
  const [show, setShow] = useState(false)
  const [author, setAuthor] = useState({})

  useEffect(() => {
    setIsActive(true)
    
    if (!authors) {
      Http.get("authors")
        .then(response => {
          setAuthors(response.data)
        })
        .catch(error => {
          console.log(error.response.data)
        })
    }
    
    if (authors) {
      setIsActive(false)
    }
  }, [authors])
  const handleClose = () => {
    setShow(false)
    setAuthor({})
  }
  const handleShow = (item = false) => {
    if (item) setAuthor(item)
    setShow(true)
  }
  const handleForm = event => {
    author[event.target.id] = event.target.value
    setAuthor({ ...author })
    console.log(author)
  }
  const deleteAuthor = (author = false) => {
    swal({
      title: "Você tem certeza?",
      text: "Esta açao não poderá ser desfeita",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(willDelete => {
      if (willDelete) {
        setIsActive(true)
        Http.delete(`authors/${author.id}`)
          .then(response => {
            swal("Pronto, excluído com sucesso", {
              icon: "success",
            })
            setAuthors(false)
            setAuthor({})
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
    if (typeof author.id === `undefined`) {
      service = Http.post("authors", {
        ...author,
      })
    } else {
      service = Http.put(`authors/${author.id}`, {
        ...author,
      })
    }
    service
      .then(response => {
        setShow(false)
        setAuthors(false)
        setAuthor(false)
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
      <Layout pageInfo={{ pageName: "authors" }}>
        <SEO title="Autores" keywords={[`UNYLEYA`, `teste`, `Autores`]} />
        <Container fluid>
          <Row>
            <Card className="col-12">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between">
                  <span>Autores</span>
                  <Button onClick={() => handleShow()} variant="success">
                    Cadastrar
                  </Button>{" "}
                </Card.Title>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nome</th>
                      <th>Ano de nascimento</th>
                      <th>Nacionalidade</th>
                      <th>Sexo</th>
                      <th>Opçôes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authors &&
                      authors.map(item => {
                        return (
                          <tr>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.year_of_birth}</td>
                            <td>{item.nationality}</td>
                            <td>{item.gender}</td>
                            <td>
                              <ButtonGroup aria-label="Basic example">
                                <Button
                                  onClick={() => handleShow(item)}
                                  variant="warning"
                                >
                                  Editar
                                </Button>
                                <Button
                                  onClick={() => deleteAuthor(item)}
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
                <Modal show={show} onHide={handleClose}>
                  <LoadingOverlay
                    active={isActive}
                    spinner
                    text="Carregando, aguarde..."
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Dados cadastrais do autor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group controlId="name">
                          <Form.Label>Nome do autor</Form.Label>
                          <Form.Control
                            type="text"
                            value={author.name ?? ""}
                            onChange={handleForm}
                            placeholder="Nome do autor"
                          />
                        </Form.Group>
                        <Form.Group controlId="year_of_birth">
                          <Form.Label>Ano de nascimento</Form.Label>
                          <Form.Control
                            type="number"
                            value={author.year_of_birth ?? ""}
                            onChange={handleForm}
                            placeholder="Ano de nascimento"
                          />
                        </Form.Group>
                        <Form.Group controlId="nationality">
                          <Form.Label>Nacionalidade</Form.Label>
                          <Form.Control
                            type="text"
                            value={author.nationality ?? ""}
                            onChange={handleForm}
                            placeholder="Nacionalidade"
                          />
                        </Form.Group>
                        <Form.Group controlId="gender">
                          <Form.Label>Gênero</Form.Label>
                          <Form.Control as="select" onChange={handleForm}>
                            <option>Selecione</option>
                            {['F', 'M'].map(item => (
                                <option
                                  selected={author.gender === item}
                                  value={item}
                                >
                                  {item}
                                </option>
                              ))}
                          </Form.Control>
                        </Form.Group>
                       
                       
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Fechar
                      </Button>
                      <Button variant="primary" onClick={save}>
                        Salvar autor
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

export default Authors
