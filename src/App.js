import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { Trash, FileEarmarkPlus } from 'react-bootstrap-icons';

import Calc from './Calc.js';
import './App.css';
import Geo1 from './geo1.svg';
import Geo2 from './geo2.svg';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profiles: [
                {
                    name: 'default',
                    dw: '250',
                    lp: '139',
                    beta: '15',
                    ds: '12',
                    dj: '12',
                    o: '50',
                    hc: '30',
                },
            ],
            activeProfile: 0,
            showDeleteConfirm: false,
        };
        if (typeof localStorage !== 'undefined') {
            var persistedState = localStorage.getItem('state');
            if (persistedState) {
                this.state = JSON.parse(persistedState);
                this.state.showDeleteConfirm = false;
            }
        }

        this.presets = [
            {
                name: '200 mm Wheel',
                dw: '200',
                lp: '139',
                beta: '15',
                ds: '12',
                dj: '12',
                o: '0',
                hc: '0',
            },
            {
                name: '250 mm Wheel',
                dw: '250',
                lp: '139',
                beta: '15',
                ds: '12',
                dj: '12',
                o: '0',
                hc: '0',
            },
            {
                name: 'T8 vertical USB',
                dw: '250',
                lp: '139',
                beta: '15',
                ds: '12',
                dj: '12',
                o: '50',
                hc: '29',
            },
            {
                name: 'T4',
                dw: '200',
                lp: '139',
                beta: '15',
                ds: '12',
                dj: '12',
                o: '50',
                hc: '20',
            },
        ];

        this.handleSelect = this.handleSelect.bind(this);
        this.handleDuplicate = this.handleDuplicate.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleDeleteConfirmClose = this.handleDeleteConfirmClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.calc = new Calc();
    }

    handleSelect(key, ev) {
        const i = parseInt(key, 10);
        if (i < this.state.profiles.length) {
            this.setState({ activeProfile: i });
        } else {
            var profile = JSON.parse(JSON.stringify(this.presets[i - this.state.profiles.length]));
            this.state.profiles.push(profile);
            this.setState({
                profiles: this.state.profiles,
                activeProfile: this.state.profiles.length - 1
            });
        }
    }

    handleDuplicate() {
        var profile = JSON.parse(JSON.stringify(this.state.profiles[this.state.activeProfile]));
        profile.name += ' (copy)';
        this.state.profiles.push(profile);
        this.setState({
            profiles: this.state.profiles,
            activeProfile: this.state.profiles.length - 1
        });
    }

    handleRemove() {
        if (this.state.profiles.length > 1) {
            this.setState({ showDeleteConfirm: true });
        }
    }

    handleDeleteConfirmClose(confirmed) {
        if (confirmed && this.state.profiles.length > 1) {
            this.state.profiles.splice(this.state.activeProfile, 1);
            var i = this.state.activeProfile;
            if (i >= this.state.profiles.length) {
                i = this.state.profiles.length - 1;
            }
            this.setState({
                profiles: this.state.profiles,
                activeProfile: i
            });
        }
        this.setState({ showDeleteConfirm: false });
    }

    handleChange(ev) {
        const target = ev.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        var profile = this.state.profiles[this.state.activeProfile];
        profile[name] = value;
        this.setState({ profiles: this.state.profiles });
    }

    handleSubmit(ev) {
        ev.preventDefault();
    }

    componentDidUpdate() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('state', JSON.stringify(this.state));
        }
    }

    render() {
        const profile = this.state.profiles[this.state.activeProfile];
        this.calc.set(profile);
        const c = this.calc.get();

        var selectItems = [];
        selectItems.push(<Dropdown.Header>my Profiles</Dropdown.Header>);
        this.state.profiles.forEach((profile, index) => {
            selectItems.push(
                <Dropdown.Item active={index === this.state.activeProfile} eventKey={index} onSelect={this.handleSelect}>
                    {profile.name}
                </Dropdown.Item>
            );
        });
        selectItems.push(<Dropdown.Header>add Preset</Dropdown.Header>);
        this.presets.forEach((profile, index) => {
            selectItems.push(
                <Dropdown.Item eventKey={this.state.profiles.length + index} onSelect={this.handleSelect}>
                    {profile.name}
                </Dropdown.Item>
            );
        });

        return (
            <Container>
                <Form onSubmit={this.handleSubmit}>
                    <Row className="my-4">
                        <Col sm="4">
                            <Dropdown>
                                <Dropdown.Toggle id="machine" size="lg" className="app-shadow">
                                    Profiles
			                    </Dropdown.Toggle>
                                <Dropdown.Menu className="app-shadow">
                                    {selectItems}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col sm="8">
                            <InputGroup className="app-shadow">
                                <Form.Control size="lg" type="text" name="name" value={profile.name} onChange={this.handleChange} />
                                <InputGroup.Append>
                                    <Button variant="success" size="lg" title="duplicate" onClick={this.handleDuplicate}>&nbsp;<FileEarmarkPlus />&nbsp;</Button>
                                    <Button variant="danger" size="lg" title="remove" onClick={this.handleRemove} disabled={this.state.profiles.length <= 1}>&nbsp;<Trash />&nbsp;</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Card className="mb-4">
                        <Card.Header>
                            Sharpening Angle
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col lg={3} className="mb-2">
                                    <img src={Geo1} />
                                </Col>
                                <Col lg={9}>
                                    <Form.Group as={Row} controlId="dw">
                                        <Form.Label column sm={3}>Wheel Diameter</Form.Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>d<sub>w</sub></InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control type="text" name="dw" value={profile.dw} onChange={this.handleChange} />
                                                <InputGroup.Append>
                                                    <InputGroup.Text>mm</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="lp">
                                        <Form.Label column sm={3}>Projection Distance</Form.Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>l<sub>p</sub></InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control type="text" name="lp" value={profile.lp} onChange={this.handleChange} />
                                                <InputGroup.Append>
                                                    <InputGroup.Text>mm</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="beta">
                                        <Form.Label column sm={3}>Grind Angle</Form.Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>β</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control type="text" name="beta" value={profile.beta} onChange={this.handleChange} />
                                                <InputGroup.Append>
                                                    <InputGroup.Text>°</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="hr">
                                        <Form.Label column sm={3}>Wheel Distance</Form.Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>h<sub>r</sub></InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control type="text" readOnly placeholder={c.hr} />
                                                <InputGroup.Append>
                                                    <InputGroup.Text>mm</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Col>
                                    </Form.Group>
                                    {profile.hc > 0 &&
                                        <Form.Group as={Row} controlId="hn">
                                            <Form.Label column sm={3}>Case Distance</Form.Label>
                                            <Col sm={9}>
                                                <InputGroup>
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text>h<sub>n</sub></InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <Form.Control type="text" readOnly placeholder={c.hn} />
                                                    <InputGroup.Append>
                                                        <InputGroup.Text>mm</InputGroup.Text>
                                                    </InputGroup.Append>
                                                </InputGroup>
                                            </Col>
                                        </Form.Group>
                                    }
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Card className="mb-4">
                        <Card.Header>
                            Machine Settings
		                </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col lg={3} className="mb-2">
                                    <img src={Geo2} />
                                </Col>
                                <Col lg={9}>
                                    <Form.Group as={Row} controlId="ds">
                                        <Form.Label column sm={3}>Support Bar Diameter</Form.Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>d<sub>s</sub></InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control type="text" name="ds" value={profile.ds} onChange={this.handleChange} />
                                                <InputGroup.Append>
                                                    <InputGroup.Text>mm</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="dj">
                                        <Form.Label column sm={3}>Knife Jig Diameter</Form.Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>d<sub>j</sub></InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control type="text" name="dj" value={profile.dj} onChange={this.handleChange} />
                                                <InputGroup.Append>
                                                    <InputGroup.Text>mm</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="o">
                                        <Form.Label column sm={3}>Support Bar Offset</Form.Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>o</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control type="text" name="o" value={profile.o} onChange={this.handleChange} />
                                                <InputGroup.Append>
                                                    <InputGroup.Text>mm</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="hc">
                                        <Form.Label column sm={3}>Case Height</Form.Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>h<sub>c</sub></InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control type="text" name="hc" value={profile.hc} onChange={this.handleChange} />
                                                <InputGroup.Append>
                                                    <InputGroup.Text>mm</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Col>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Row className="mb-4">
                    </Row>
                </Form>
                <Modal show={this.state.showDeleteConfirm} onHide={this.handleDeleteConfirmClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete the current profile?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleDeleteConfirmClose(false)}>
                            Cancel
		                </Button>
                        <Button variant="danger" onClick={() => this.handleDeleteConfirmClose(true)}>
                            Delete
		                </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}

export default App;
