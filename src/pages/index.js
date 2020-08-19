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

const Books = () => {
  const [books, setBooks] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [genrers, setGenrers] = useState(false)
  const [authors, setAuthors] = useState(false)
  const [publishers, setPublishers] = useState(false)
  const [show, setShow] = useState(false)
  const [book, setBook] = useState({})

  useEffect(() => {
    setIsActive(true)
    if (!books) {
      Http.get("books")
        .then(response => {
          setBooks(response.data)
        })
        .catch(error => {
          console.log(error.response.data)
        })
    }
    if (!genrers) {
      Http.get("genrers")
        .then(response => {
          setGenrers(response.data)
        })
        .catch(error => {
          console.log(error.response.data)
        })
    }
    if (!authors) {
      Http.get("authors")
        .then(response => {
          setAuthors(response.data)
        })
        .catch(error => {
          console.log(error.response.data)
        })
    }
    if (!publishers) {
      Http.get("publishers")
        .then(response => {
          setPublishers(response.data)
        })
        .catch(error => {
          console.log(error.response.data)
        })
    }
    if (books && genrers && authors && publishers) {
      setIsActive(false)
    }
  }, [books, genrers, authors, publishers])
  const handleClose = () => {
    setShow(false)
    setBook({})
  }
  const handleShow = (item = false) => {
    if (item) setBook(item)
    setShow(true)
  }
  const handleForm = event => {
    book[event.target.id] = event.target.value
    setBook({ ...book })
    console.log(book)
  }
  const deleteBook = (book = false) => {
    swal({
      title: "Você tem certeza?",
      text: "Esta açao não poderá ser desfeita",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(willDelete => {
      if (willDelete) {
        setIsActive(true)
        Http.delete(`books/${book.id}`)
          .then(response => {
            swal("Pronto, excluído com sucesso", {
              icon: "success",
            })
            setBooks(false)
            setBook(false)
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
    if (typeof book.id === `undefined`) {
      service = Http.post("books", {
        ...book,
      })
    } else {
      service = Http.put(`books/${book.id}`, {
        ...book,
      })
    }
    service
      .then(response => {
        setShow(false)
        setBooks(false)
        setBook(false)
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
      <Layout pageInfo={{ pageName: "index" }}>
        <SEO title="Livros" keywords={[`UNYLEYA`, `teste`, `livros`]} />
        <Container fluid>
          <Row>
            <Card className="col-12">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between">
                  <span>Livros</span>
                  <Button onClick={handleShow} variant="success">
                    Cadastrar
                  </Button>{" "}
                </Card.Title>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nome</th>
                      <th>Lançamento</th>
                      <th>Autor</th>
                      <th>Gênero</th>
                      <th>Editora</th>
                      <th>Opçôes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books &&
                      books.map(item => {
                        return (
                          <tr>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.publication_year}</td>
                            <td>{item.author.name}</td>
                            <td>{item.genrer.name}</td>
                            <td>{item.publisher.name}</td>
                            <td>
                              <ButtonGroup aria-label="Basic example">
                                <Button
                                  onClick={() => handleShow(item)}
                                  variant="warning"
                                >
                                  Editar
                                </Button>
                                <Button
                                  onClick={() => deleteBook(item)}
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
                      <Modal.Title>Dados cadastrais do livro</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group controlId="name">
                          <Form.Label>Nome do livro</Form.Label>
                          <Form.Control
                            type="text"
                            value={book.name ?? ""}
                            onChange={handleForm}
                            placeholder="Nome do livro"
                          />
                        </Form.Group>
                        <Form.Group controlId="publication_year">
                          <Form.Label>Ano de lançamento</Form.Label>
                          <Form.Control
                            type="number"
                            value={book.publication_year ?? ""}
                            onChange={handleForm}
                            placeholder="Ano de lançamento"
                          />
                        </Form.Group>
                        <Form.Group controlId="genrer_id">
                          <Form.Label>Gênero</Form.Label>
                          <Form.Control as="select" onChange={handleForm}>
                            <option>Selecione</option>
                            {genrers &&
                              genrers.map(item => (
                                <option
                                  selected={book.genrer_id === item.id}
                                  value={item.id}
                                >
                                  {item.name}
                                </option>
                              ))}
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="author_id">
                          <Form.Label>Autor</Form.Label>
                          <Form.Control as="select" onChange={handleForm}>
                            <option>Selecione</option>
                            {authors &&
                              authors.map(item => (
                                <option
                                  selected={book.author_id === item.id}
                                  value={item.id}
                                >
                                  {item.name}
                                </option>
                              ))}
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="publisher_id">
                          <Form.Label>Editora</Form.Label>
                          <Form.Control as="select" onChange={handleForm}>
                            <option>Selecione</option>
                            {publishers &&
                              publishers.map(item => (
                                <option
                                  selected={book.publisher_id === item.id}
                                  value={item.id}
                                >
                                  {item.name}
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
                        Salvar livro
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

export default Books
