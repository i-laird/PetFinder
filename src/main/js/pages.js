import _ from 'lodash';

import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import * as Users from 'js/users';
import * as Login from 'js/login';
import 'js/dogs2.jpg';
import 'js/cats.png';
import 'js/bunny.png';
import 'js/birds.png';
import Pulse from 'react-reveal/Pulse';
import 'bootstrap';
import 'jquery';
import 'js/sb-admin';
import 'react-chartjs-2';
import {LoginForm} from 'js/login';
import {RegistrationForm} from 'js/login';
import {Redirect} from 'react-router-dom';
import Switch from 'react-switch';
import {SideBar} from 'js/navigation';
import {NavBar} from 'js/navigation';
import {
	ChinchillaSwitch,
	FerretSwitch,
	OtherRodentSwitch,
	HamsterSwitch,
	GuineaPigSwitch,
	RabbitSwitch,
	LocationSlider
} from 'js/switches';
import Slider from 'react-rangeslider';
import WeeklyScheduler from 'react-week-scheduler';
import * as cookie from 'react-cookies';
import {RegistrationPetForm, EditPetForm} from 'js/pet';
import axios from 'axios';
import * as Bessemer from 'js/alloy/bessemer/components';
import * as Validation from 'js/alloy/utils/validation';
import * as ReduxForm from 'redux-form';
import {SitterTable} from 'js/profilemodules/sitters';
import {BookingTable} from 'js/profilemodules/bookings';

function logout() {
	cookie.remove('authentication', {path: '/'});
	cookie.remove('user', {path: '/'});
	window.location.replace('...');
}

function ClearNotification() {
	axios.get('/api/user/clearnotifications');
	location.reload();
}

export class Home extends React.Component {
	render() {
		/*TODO edit*/
		return (
			<div id="wrapper">
				<NavBar></NavBar>
				<SideBar></SideBar>
				<div className="container padded top-buffer">
					Welcome to our project!
				</div>
			</div>

		);
	}
}

const registerRedirectPage = '/profile-page';

export class RegisterPage extends React.Component {
	state = {
		shouldRedirect: false
	}
	setRedirect = () => {
		this.setState({shouldRedirect: true});
	}
	redirectPage = () => {
		if (this.state.shouldRedirect) {
			return <Redirect to={registerRedirectPage}/>;
		}
	}

	render() {
		return (

			<body className="register-background fixed-top " id="page-top">

			{this.redirectPage()}
			<Pulse>
				<div className="myContainer pull-left">
					<div className="card card-login mx-auto mt-9">
						<div className="card-header">Register</div>
						<div className="card-body">
							<RegistrationForm/>
							<a className="d-block small" href="/#/login">login</a>

						</div>

					</div>
				</div>
			</Pulse>
			<Logout/>

			</body>
		);
	}
}

const loginRedirectPage = '/profile-page';

export class LoginPage extends React.Component {
	state = {
		shouldRedirect: false
	}
	setRedirect = () => {
		this.setState({shouldRedirect: true});
	}
	redirectPage = () => {
		if (this.state.shouldRedirect) {
			return <Redirect to={loginRedirectPage}/>;
		}
	}

	render() {
		return (
			<body className="login-background fixed-top " id="page-top">
			{this.redirectPage()}
			<Pulse>
				<div className="container justify-content-center">
					<div className="card card-login mx-auto mt-5">
						<div className="card-header">Login</div>
						<div className="card-body">
							<LoginForm success={this.setRedirect}/>
							<div className="text-center">
								<a className="d-block small mt-3" href="#/register">Register an Account</a>
								<a className="d-block small" href="forgot-password.html">Forgot Password?</a>
							</div>
						</div>
					</div>
				</div>
			</Pulse>
			<Logout/>
			</body>
		);
	}
}

function initpetform(pet){
    let vals = {};
    ['name', 'type', 'subtype', 'preferences'].forEach(x => {
        vals[pet.id + x] = pet[x];
    });
    return vals;
}

class ProfilePage extends React.Component {
	constructor(props) {
		super(props);
		/* set the initial checkboxState to true */
		this.state = {
			available: [false, false, false, false, false, false, false]
		};
	}

	componentDidMount() {
		axios.get('/api/user/getDays')
			.then(res => {
				const bools = res.bools;
				this.setState({
					available: bools
				});
			});
		axios.get('/api/user')
			.then(res => {
				console.log(res);
				this.setState({user: res});
			});
		axios.get('/api/userPets/ugly')
			.then(res => {
				console.log(res);
				this.setState({pets: res.pets});
			});
	}


	onSubmit(event) {
		console.log('Submitting');
		event.preventDefault();
		let toPost = {
			'bools': this.state.available
		};
		axios.post('/api/user/setdays', toPost);
	}

	/* callback to change the checkboxState to false when the checkbox is checked */
	toggleAvailable(day, event) {
		let newAvailable = this.state.available;
		newAvailable[day] = !newAvailable[day];
		this.setState({
			available: newAvailable
		});
	}

	render() {
		let availableCheck = [];
		const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
		for (let i = 0; i < 7; i++) {
			availableCheck.push(
				<h3><label className="container-checkbox">{week[i]}
					<input type="checkbox" checked={this.state.available[i]}
					       onClick={this.toggleAvailable.bind(this, i)}/>
					<span className="checkmark"></span>
				</label></h3>
			);
		}
		return (

			<div className="container padded">
				<NavBar/>
				<SideBar/>
				<div className="top-buffer shiftRight">
					{_.isDefined(this.props.authentication)
						//<div>{this.props.authentication['access_token']}</div>
					}
					{_.isDefined(this.props.user) &&
					<div>Welcome, {this.props.user.principal}!</div>
					}
					{
						this.state.user && this.state.user.notification &&
						<div>Your current notifications: {this.state.user.notification.map(test =>
							<tr>
								<td>{test.toString()}</td>
							</tr>
						)}</div>
					}
					<button className="btn btn-primary" onClick={() => ClearNotification()}>Clear Notifications</button>

					{
						this.state.pets &&
						this.state.pets.map(pet =>
							<EditPetForm pet={pet} initialValues={initpetform(pet)}/>
						)
					}
					<div className="card">
						<div className="card-body justify-content-center">
							<form onSubmit={this.onSubmit.bind(this)}>
								{availableCheck.map(checkbox => {
									return checkbox;
								})}
								<button type="submit">Save</button>
							</form>
						</div>
					</div>
					{
						this.state.user &&
						<React.Fragment>
							{
								this.state.user.type === 'SITTER' &&
								'You are a sitter.'
							}
							<BookingTable user={this.state.user}/>
							{
								this.state.user.type === 'OWNER' &&
								<SitterTable/>
							}
						</React.Fragment>
					}
				</div>

			</div>
		);
	}
}

ProfilePage = connect(
	state => ({
		authentication: Users.State.getAuthentication(state),
		user: Users.State.getUser(state)
	})
)(ProfilePage);

export {ProfilePage};

export class RodentSearch extends React.Component {
	constructor() {
		super();
		this.state = {
			rodents: [],
			allRodents: [],
			hamsterChecked: true,
			rabbitChecked: true,
			guineaPigChecked: true,
			ferretChecked: true,
			chinchillaChecked: true,
			otherChecked: true,
		};
		this.handleChangeHamster = this.handleChangeHamster.bind(this);
		this.handleChangeOther = this.handleChangeOther.bind(this);
		this.handleChangeChinchilla = this.handleChangeChinchilla.bind(this);
		this.handleChangeFerret = this.handleChangeFerret.bind(this);
		this.handleChangeRabbit = this.handleChangeRabbit.bind(this);
		this.handleChangeGuineaPig = this.handleChangeGuineaPig.bind(this);
	}


	componentDidMount() {
		axios.get('/pets/rodents')
			.then(res => {
				const pets = res.pets;
				console.log(pets);
				this.setState({rodents: pets});
				this.setState({allRodents: pets});
			});
	}

	handleChangeHamster(checked) {
		this.setState({checked});
		this.setState({hamsterChecked: !this.state.hamsterChecked});
		this.filterAnimals();
	}

	handleChangeRabbit(checked) {
		this.setState({checked});
		this.setState({rabbitChecked: !this.state.rabbitChecked});
		this.filterAnimals();
	}

	handleChangeFerret(checked) {
		this.setState({checked});
		this.setState({ferretChecked: !this.state.ferretChecked});
		this.filterAnimals();
	}

	handleChangeGuineaPig(checked) {
		this.setState({checked});
		this.setState({guineaPigChecked: !this.state.guineaPigChecked});
		this.filterAnimals();
	}

	handleChangeChinchilla(checked) {
		this.setState({checked});
		this.setState({chinchillaChecked: !this.state.chinchillaChecked});
		this.filterAnimals();
	}

	handleChangeOther(checked) {
		this.setState({checked});
		this.setState({otherChecked: !this.state.otherChecked});
		this.filterAnimals();
	}

	filterAnimals() {
		this.setState({rodents: this.state.allRodents});
		if (!this.state.hamsterChecked) {
			this.setState({rodents: this.state.rodents.filter(rodent => rodent.subtype != 'Hamster')});
		}
		if (!this.state.guineaPigChecked) {
			this.setState({rodents: this.state.rodents.filter(rodent => rodent.subtype != 'Guinea Pig')});
		}
		if (!this.state.rabbitChecked) {
			this.setState({rodents: this.state.rodents.filter(rodent => rodent.subtype != 'Rabbit')});
		}
		if (!this.state.otherChecked) {
			this.setState({rodents: this.state.rodents.filter(rodent => rodent.subtype != 'Other')});
		}
		if (!this.state.chinchillaChecked) {
			this.setState({rodents: this.state.rodents.filter(rodent => rodent.subtype != 'Chinchilla')});
		}
		if (!this.state.ferretChecked) {
			this.setState({rodents: this.state.rodents.filter(rodent => rodent.subtype != 'Ferret')});
		}
		//Note: You have to slide to fix, tap doesnt work
		this.forceUpdate();
	}

	render() {
		return (
			<html lang="en">
			<body id="page-top">
			<div id="wrapper">
				<NavBar></NavBar>
				<SideBar></SideBar>
				<div id="content-wrapper">
					<div class="top-buffer">
					</div>
					<div class="container shiftRight">
						<ol class="breadcrumb">
							<li class="breadcrumb-item">
								<a href="#">Dashboard</a>
							</li>
							<li class="breadcrumb-item active">Find Pets</li>
						</ol>
						<div class="card mb-3">
							<div class="card-header">
								<i class="fas fa-table"></i>
								Rodents
							</div>
							<div class="card-body">
								<table className="table" id="dataTable" width="100%" cellSpacing="0">
									<thead>
									<tr>
										<th className="pl-5"><span>Hamsters</span><Switch
											checked={this.state.hamsterChecked}
											onChange={this.handleChangeHamster}
											onColor="#86d3ff"
											onHandleColor="#2693e6"
											handleDiameter={30}
											uncheckedIcon={false}
											checkedIcon={false}
											boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
											activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
											height={20}
											width={48}
											className="react-switch"
											id="material-switch"
										/></th>
										<th className="pl-5"><span>Rabbits</span><Switch
											checked={this.state.rabbitChecked}
											onChange={this.handleChangeRabbit}
											onColor="#86d3ff"
											onHandleColor="#2693e6"
											handleDiameter={30}
											uncheckedIcon={false}
											checkedIcon={false}
											boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
											activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
											height={20}
											width={48}
											className="react-switch"
											id="material-switch"
										/></th>
										<th className="pl-5"><span>Guinea Pigs</span><Switch
											checked={this.state.guineaPigChecked}
											onChange={this.handleChangeGuineaPig}
											onColor="#86d3ff"
											onHandleColor="#2693e6"
											handleDiameter={30}
											uncheckedIcon={false}
											checkedIcon={false}
											boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
											activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
											height={20}
											width={48}
											className="react-switch"
											id="material-switch"
										/></th>
									</tr>
									<tr>
										<th className="pl-5"><span>Ferrets</span><Switch
											checked={this.state.ferretChecked}
											onChange={this.handleChangeFerret}
											onColor="#86d3ff"
											onHandleColor="#2693e6"
											handleDiameter={30}
											uncheckedIcon={false}
											checkedIcon={false}
											boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
											activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
											height={20}
											width={48}
											className="react-switch"
											id="material-switch"
										/></th>
										<th className="pl-5"><span>Chinchillas</span><Switch
											checked={this.state.chinchillaChecked}
											onChange={this.handleChangeChinchilla}
											onColor="#86d3ff"
											onHandleColor="#2693e6"
											handleDiameter={30}
											uncheckedIcon={false}
											checkedIcon={false}
											boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
											activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
											height={20}
											width={48}
											className="react-switch"
											id="material-switch"
										/></th>
										<th className="pl-5"><span>Other</span><Switch
											checked={this.state.otherChecked}
											onChange={this.handleChangeOther}
											onColor="#86d3ff"
											onHandleColor="#2693e6"
											handleDiameter={30}
											uncheckedIcon={false}
											checkedIcon={false}
											boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
											activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
											height={20}
											width={48}
											className="react-switch"
											id="material-switch"
										/></th>
									</tr>
									</thead>
								</table>
								<LocationSlider/>
								<div className="table-responsive">
									<table className="table table-bordered" id="dataTable" width="90%" cellSpacing="0">
										<Pulse>
											<thead>
											<tr>
												<td>Name</td>
												<td>Owner</td>
												<td>Subtype</td>
												<td>Preferences</td>
											</tr>
											</thead>
											<tbody>
											{this.state.rodents.sort((a, b) => a.name > b.name).map(pet =>
												<tr>
													<td>{pet.name}</td>
													<td>{pet.owner}</td>
													<td>{pet.subtype}</td>
													<td>{pet.preferences}</td>
												</tr>
											)}
											</tbody>
										</Pulse>
									</table>
								</div>
							</div>
							<div class="card-footer small text-muted">Updated yesterday at 11:59 PM</div>
						</div>
					</div>
					<footer class="footer navbar-fixed-bottom">
						<div class="container shiftRight my-auto">
							<div class="copyright text-center my-auto">
								<span>Copyright © Your Website 2018</span>
							</div>
						</div>
					</footer>
				</div>
			</div>
			<a class="scroll-to-top rounded" href="#page-top">
				<i class="fas fa-angle-up"></i>
			</a>
			<Logout/>
			</body>
			</html>
		);
	}
}

export class DogSearch extends React.Component {
	state = {
		dogs: []
	};

	componentDidMount() {
		axios.get('/pets/dogs')
			.then(res => {
				const pets = res.pets;
				console.log(pets);
				this.setState({dogs: pets});
			});
	}

	render() {
		return (
			<body id="page-top">
			<div id="wrapper">
				<NavBar></NavBar>
				<SideBar></SideBar>
				<div id="content-wrapper">
					<div class="top-buffer">
					</div>
					<div class="container shiftRight">
						<ol class="breadcrumb">
							<li class="breadcrumb-item">
								<a href="#">Dashboard</a>
							</li>
							<li class="breadcrumb-item active">Find Pets</li>
						</ol>
						<div class="card mb-3">
							<div class="card-header">
								<i class="fas fa-table"></i>
								Dogs
							</div>
							<div class="card-body">
								<LocationSlider/>
								<div className="table-responsive">
									<table className="table table-bordered" id="dataTable" width="90%" cellSpacing="0">
										<Pulse>
											<thead>
											<tr>
												<td>Name</td>
												<td>Owner</td>
												<td>Subtype</td>
												<td>Preferences</td>
											</tr>
											</thead>
											<tbody>
											{this.state.dogs.sort((a, b) => a.name > b.name).map(pet =>
												<tr>
													<td>{pet.name}</td>
													<td>{pet.owner}</td>
													<td>{pet.subtype}</td>
													<td>{pet.preferences}</td>
												</tr>
											)}
											</tbody>
										</Pulse>
									</table>
								</div>
							</div>
							<div class="card-footer small text-muted">Updated yesterday at 11:59 PM</div>
						</div>
					</div>
					<footer class="footer navbar-fixed-bottom">
						<div class="container shiftRight my-auto">
							<div class="copyright text-center my-auto">
								<span>Copyright © Your Website 2018</span>
							</div>
						</div>
					</footer>
				</div>
			</div>
			<a class="scroll-to-top rounded" href="#page-top">
				<i class="fas fa-angle-up"></i>
			</a>
			<Logout/>
			</body>
		);
	}
}

export class BirdSearch extends React.Component {
	render() {
		return (
			<html lang="en">
			<body id="page-top">
			<div id="wrapper">
				<NavBar></NavBar>
				<SideBar></SideBar>
				<div id="content-wrapper">
					<div class="top-buffer">
					</div>
					<div class="container shiftRight">
						<ol class="breadcrumb">
							<li class="breadcrumb-item">
								<a href="#">Dashboard</a>
							</li>
							<li class="breadcrumb-item active">Find Pets</li>
						</ol>
						<div class="card mb-3">
							<div class="card-header">
								<i class="fas fa-table"></i>
								Birds
							</div>
							<div class="card-body">
								<table className="table" id="dataTable" width="100%" cellSpacing="0">
									<thead>
									<tr>
									</tr>
									</thead>
								</table>
								<LocationSlider/>
								<div class="table-responsive">
									<table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
										<thead>
										<tr>
											<th>Name</th>
											<th>Position</th>
											<th>Office</th>
											<th>Age</th>
											<th>Start date</th>
											<th>Salary</th>
										</tr>
										</thead>
										<tfoot>
										<tr>
											<th>Name</th>
											<th>Position</th>
											<th>Office</th>
											<th>Age</th>
											<th>Start date</th>
											<th>Salary</th>
										</tr>
										</tfoot>
										<tbody>
										<tr>
											<td>Jena Gaines</td>
											<td>Office Manager</td>
											<td>London</td>
											<td>30</td>
											<td>2008/12/19</td>
											<td>$90,560</td>
										</tr>
										<tr>
											<td>Quinn Flynn</td>
											<td>Support Lead</td>
											<td>Edinburgh</td>
											<td>22</td>
											<td>2013/03/03</td>
											<td>$342,000</td>
										</tr>
										<tr>
											<td>Charde Marshall</td>
											<td>Regional Director</td>
											<td>San Francisco</td>
											<td>36</td>
											<td>2008/10/16</td>
											<td>$470,600</td>
										</tr>
										<tr>
											<td>Haley Kennedy</td>
											<td>Senior Marketing Designer</td>
											<td>London</td>
											<td>43</td>
											<td>2012/12/18</td>
											<td>$313,500</td>
										</tr>
										<tr>
											<td>Tatyana Fitzpatrick</td>
											<td>Regional Director</td>
											<td>London</td>
											<td>19</td>
											<td>2010/03/17</td>
											<td>$385,750</td>
										</tr>
										<tr>
											<td>Michael Silva</td>
											<td>Marketing Designer</td>
											<td>London</td>
											<td>66</td>
											<td>2012/11/27</td>
											<td>$198,500</td>
										</tr>
										<tr>
											<td>Paul Byrd</td>
											<td>Chief Financial Officer (CFO)</td>
											<td>New York</td>
											<td>64</td>
											<td>2010/06/09</td>
											<td>$725,000</td>
										</tr>
										<tr>
											<td>Gloria Little</td>
											<td>Systems Administrator</td>
											<td>New York</td>
											<td>59</td>
											<td>2009/04/10</td>
											<td>$237,500</td>
										</tr>
										<tr>
											<td>Bradley Greer</td>
											<td>Software Engineer</td>
											<td>London</td>
											<td>41</td>
											<td>2012/10/13</td>
											<td>$132,000</td>
										</tr>
										<tr>
											<td>Dai Rios</td>
											<td>Personnel Lead</td>
											<td>Edinburgh</td>
											<td>35</td>
											<td>2012/09/26</td>
											<td>$217,500</td>
										</tr>
										</tbody>
									</table>
								</div>
							</div>
							<div class="card-footer small text-muted">Updated yesterday at 11:59 PM</div>
						</div>
					</div>
					<footer class="footer navbar-fixed-bottom">
						<div class="container shiftRight my-auto">
							<div class="copyright text-center my-auto">
								<span>Copyright © Your Website 2018</span>
							</div>
						</div>
					</footer>
				</div>
			</div>
			<Logout/>
			</body>
			</html>
		);
	}
}

export class CatSearch extends React.Component {
	state = {
		cats: []
	};

	componentDidMount() {
		axios.get('/pets/cats')
			.then(res => {
				const pets = res.pets;
				console.log(pets);
				this.setState({cats: pets});
			});
	}

	render() {
		return (
			<html lang="en">
			<body id="page-top">
			<div id="wrapper">
				<NavBar></NavBar>
				<SideBar></SideBar>
				<div id="content-wrapper">
					<div class="top-buffer">
					</div>
					<div class="container shiftRight">
						<ol class="breadcrumb">
							<li class="breadcrumb-item">
								<a href="#">Dashboard</a>
							</li>
							<li class="breadcrumb-item active">Find Pets</li>
						</ol>
						<div class="card mb-3">
							<div class="card-header">
								<i class="fas fa-table"></i>
								Cats
							</div>
							<div class="card-body">
								<table className="table" id="dataTable" width="100%" cellSpacing="0">
									<thead>
									</thead>
								</table>
								<LocationSlider/>
								<div class="table-responsive">
									<table class="table table-bordered" id="dataTable" width="90%" cellspacing="0">
										<Pulse>
											<thead>
											<tr>
												<td>Name</td>
												<td>Owner</td>
												<td>Subtype</td>
												<td>Preferences</td>
											</tr>
											</thead>
											<tbody>
											{this.state.cats.sort((a, b) => a.name > b.name).map(pet =>
												<tr>
													<td>{pet.name}</td>
													<td>{pet.owner}</td>
													<td>{pet.subtype}</td>
													<td>{pet.preferences}</td>
												</tr>
											)}
											</tbody>
										</Pulse>
									</table>
								</div>
							</div>
							<div class="card-footer small text-muted">Updated yesterday at 11:59 PM</div>
						</div>
					</div>
					<footer class="footer navbar-fixed-bottom">
						<div class="container my-auto">
							<div class="copyright text-center my-auto">
								<span>Copyright © Your Website 2018</span>
							</div>
						</div>
					</footer>
				</div>
			</div>
			<Logout/>
			</body>
			</html>
		);
	}
}


export class Dashboard extends React.Component {
	render() {
		return (

			<html lang="en">
			<body id="page-top">
			<div id="wrapper">
				<NavBar></NavBar>
				<SideBar></SideBar>
				<div id="content-wrapper">
					<div class="top-buffer">
					</div>
					<div class="container shiftRight">
						<ol class="breadcrumb">
							<li class="breadcrumb-item">
								<a href="#">Dashboard</a>
							</li>
							<li class="breadcrumb-item active">Find Pets</li>
						</ol>

						<Pulse>
							<div class="row justify-content-center ">
								<div class="col-xl-4 col-sm-9 mb-3 card text-white bg-light o-hidden h-35">
									<a className="card-footer text-black-50 clearfix small z-1" href="#/dog-search">
										<span className="float-left"><b>Dogs</b></span>
										<span className="float-right">
                    <i className="fas fa-angle-right"></i>
                  </span>
									</a>
									<div class="card-body align-bottom">
										<div className="card-img-overlay dog-crop align-bottom">
											<img src={'https://i.postimg.cc/DwXpZCDK/dogs.png'}
											     className=" dog-crop card-img-bottom"></img>
										</div>
									</div>

								</div>
								<div className="pr-2"></div>
								<div className="col-xl-4 col-sm-9 mb-3 card text-white bg-light o-hidden h-35">
									<a className="card-footer text-black-50 clearfix small z-1" href="#/cat-search">
										<span className="float-left"><b>Cats</b></span>
										<span className="float-right">
                    <i className="fas fa-angle-right"></i>
                  </span>
									</a>
									<div className="card-body">
										<div className="card-img-overlay">
											<img src={'https://i.postimg.cc/Jn1ppRh1/cats.png'}
											     className="card-img-bottom"></img>
										</div>
									</div>
								</div>
							</div>
							<div class="row justify-content-center ">
								<div className="col-xl-4 col-sm-9 mb-3 card text-white bg-light o-hidden h-35">
									<a className="card-footer text-black-50 clearfix small z-1" href="#/rodent-search">
										<span className="float-left"><b>Rodents</b></span>
										<span className="float-right">
                    <i className="fas fa-angle-right"></i>
                  </span>
									</a>
									<div className="card-body">
										<div className="card-img-overlay">
											<img src={'https://i.postimg.cc/kMLpm31y/bunny.png'}
											     className="card-img-bottom bunny-crop "></img>
										</div>
									</div>

								</div>
								<div className="pr-2"></div>
								<div className="col-xl-4 col-sm-9 mb-3 card text-white bg-light o-hidden h-35">

									<a className="card-footer text-black-50 clearfix small z-1" href="#/bird-search">
										<span className="float-left"><b>Birds</b></span>
										<span className="float-right">
                    <i className="fas fa-angle-right"></i>
                  </span>
									</a>
									<div className="card-body">
										<div className="card-img-overlay">
											<img src={'https://i.postimg.cc/QxRSRQMY/birds.png'}
											     className="card-img-bottom portrait-crop"></img>
										</div>
									</div>
								</div>
							</div>
						</Pulse>


					</div>

					<footer class="footer navbar-fixed-bottom">
						<div class="container shiftRight my-auto">
							<div class="copyright text-center my-auto">
								<span>Copyright © Your Website 2018</span>
							</div>
						</div>
					</footer>

				</div>
			</div>
			<Logout/>
			</body>
			</html>
		);
	}

}

var Chart = require('chart.js');

export class ReviewPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			bookings: [],
			sitters: [],
			score: '',
			review: '',
			name: '',
			reload: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleChange2 = this.handleChange2.bind(this);
		this.handleChange3 = this.handleChange3.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({name: event.target.value});
	}

	handleChange2(event) {
		if (event.target.value >= 0 && event.target.value <= 100)
			this.setState({score: event.target.value});
		else
			window.alert('Error, input between 0-100');
	}

	handleChange3(event) {
		this.setState({review: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();
		let toPost = {
			'user': this.state.name,
			'review': this.state.review,
			'assignedScore': this.state.score
		};
		axios.post('/api/user/addReviewScore', toPost);
		location.reload();
		window.alert('Review sent');
	}


	componentDidMount() {
		axios.get('/api/user')
			.then(res => {
				if (res.type == 'SITTER') {
					window.alert('Sitters Can Not Review');
					window.location.href = '#/profile-page';
					location.reload();
				}
				const myBookings = res.bookings;
				this.setState({bookings: myBookings});
			});
		axios.get('/api/user/getavailablesitters')
			.then(res => {
				const mySitters = res.users;
				this.setState({sitters: mySitters});
			});
	}

	/*TODO verify that users can only review sitters they booked*/
	render() {
		return (
			<body id="page-top">
			<div id="wrapper">
				<NavBar></NavBar>
				<SideBar></SideBar>
				<div id="content-wrapper">
					<div class="top-buffer">
					</div>
					<div class="container shiftRight">
						<ol class="breadcrumb">
							<li class="breadcrumb-item">
								<a href="#">Dashboard</a>
							</li>
							<li class="breadcrumb-item active">Bookings</li>
						</ol>
						<div class="card mb-3">
							<div class="card-header">
								<i class="fas fa-table"></i>
								Bookings
							</div>
							<div class="card-body">
								<div className="table-responsive">
									<table className="table table-bordered" id="dataTable" width="90%" cellSpacing="0">
										<Pulse>
											<thead>
											<tr>
												<td>Sitter Name</td>
												<td># Ratings</td>
												<td>Sitter Rating</td>
											</tr>
											</thead>
											<tbody>
											{this.state.sitters.map(sitters =>
												<tr>
													<td>{sitters.principal}</td>
													<td>{sitters.reviewCount - 1}</td>
													<td>{parseInt(sitters.reviewSum / sitters.reviewCount)}</td>
												</tr>
											)}

											</tbody>
										</Pulse>
									</table>
									<form onSubmit={this.handleSubmit}>
										<label>
											Enter name of Sitter you would like to review:
											<input type="text" value={this.state.name} onChange={this.handleChange}/>
										</label><br/>

										<label>
											Your Score:
											<input type="text" value={this.state.score} onChange={this.handleChange2}/>
										</label><br/>
										<label>
											Your Review (Optional):
										</label><br/><textarea className="form-control" rows="5" id="comment"
										                       type="text" value={this.state.review}
										                       onChange={this.handleChange3}></textarea>
										<input type="submit" value="Submit"/>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Logout/>
			</body>
		);
	}
}

export class AddPet extends React.Component {
	render() {
		return (

			<div className="container shiftRight top-buffer">
				<NavBar/>
				<SideBar/>

				<div className="card">
					<RegistrationPetForm/>
				</div>
			<Logout/>
			</div>
		);
	}
}

class Layout extends React.Component {
	constructor(props) {
		super(props);
        this.state = {
            dog: 0,
            cat: 0,
            rodent: 0,
            bird: 0,
        };

	}
	componentDidMount(){
        axios.get('/pets/rodents')
            .then(res => {
                const pets = res.pets;
                this.setState({rodent: pets.length});
            });
        axios.get('/pets/dogs')
            .then(res => {
                const pets = res.pets;
                this.setState({dog: pets.length});
            });
        axios.get('/pets/cats')
            .then(res => {
                const pets = res.pets;
                this.setState({cat: pets.length});
            });
        axios.get('/pets/birds')
            .then(res => {
                const pets = res.pets;
                this.setState({bird: pets.length});
            });
	}
	shouldComponentUpdate() {

		var node = this.node;
		var myChart = new Chart(node, {
			type: 'bar',
			data: {
				labels: ['Dogs', 'Cats', 'Rodents', 'Birds'],
				datasets: [
					{
						label: '# of Registered Pets',
						data: [this.state.dog, this.state.cat, this.state.rodent, this.state.bird],
						backgroundColor: [
							'rgba(255, 99, 132, 0.9)',
							'rgba(54, 162, 235, 0.9)',
							'rgba(255, 206, 86, 0.9)',
							'rgba(30,190,50,0.9)'
						]
					}
				]
			}
		});
	}

	render() {
		return (
			<div>
				<canvas
					style={{width: 800, height: 300}}
					ref={node => (this.node = node)}
				/>
			</div>
		);
	}
}

export class Logout extends React.Component {
	render() {
		return (
			<div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
			     aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
							<button className="close" type="button" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<div className="modal-body">Select "Logout" below if you are ready to end your current session.
						</div>
						<div className="modal-footer">
							<button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
							<button className="btn btn-primary" onClick={() => logout()}>Logout</button>
						</div>
					</div>
				</div>
			</div>);
	}
}

import dogAboutUs from '../resources/images/dogau.jpg';
import dogAboutUs2 from '../resources/images/dog2au.jpg';
import dogAboutUs3 from '../resources/images/dog3au.jpg';
export class AboutUs extends React.Component{
	render(){
		return(
            <div className="container shiftRight top-buffer">
                <NavBar/>
                <SideBar/>
                    <div className="container">
                        <div className="row">
                            <div className="card col-md-12 p-3">
                                <div className="row ">
                                    <div className="col-md-8">
                                        <div className="card-block">
                                            <h6 className="card-title text-right"></h6>
                                            <p className="card-text text-justify">Tempeturs was created for Pet Owners and Sitters
											to match. Simply set your availability, and create a booking to accommodate your furry
											friends.</p>
                                            <a href="#" className="btn btn-primary">My Profile</a>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <img className="w-100" src={dogAboutUs}/>
                                    </div>
                                </div>
                            </div>
                            <div className="card col-md-12 p-3">
                                <div className="row ">
                                    <div className="col-md-4">
                                        <img className="w-100" src={dogAboutUs2}/>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-block">
                                            <h6 className="card-title">Rate a Sitter</h6>
                                            <p className="card-text text-justify"> Rate and review sitters to share your Tempeturs experience! </p>
                                            <a href="/#/review-page" className="btn btn-primary">Rate a Sitter</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card col-md-12 p-3">
                                <div className="row ">
                                    <div className="col-md-4">
                                        <img className="w-100" src={dogAboutUs3}/>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-block">
                                            <h6 className="card-title">Built by the Best</h6>
                                            <p className="card-text text-justify"> Tempeturs was designed and developed by Ian Laird,
											Parakh Jaggi, Garth Terlizzi III, Aidan Edwards, and David Milliard.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card col-md-12 p-3">
                                <div className="card-header">
                                    <i className="fas fa-chart-area"></i>
                                    Number of Registered Pets
                                </div>
                                <div className="card-body">
                                    <Layout></Layout>

                                </div>
                            </div>
                        </div>
                    </div>
                <Logout/>
            </div>
		);
	}
}