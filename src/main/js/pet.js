import React from 'react';
import * as Bessemer from 'js/alloy/bessemer/components';
import * as Validation from 'js/alloy/utils/validation';
import * as ReduxForm from 'redux-form';
import connect from 'react-redux/es/connect/connect';
import * as Users from 'js/users';

class RegistrationPetForm extends React.Component {
    onSubmit = pet => {
        return this.props.register(pet);
    };

    render() {
        let { handleSubmit, submitting } = this.props;
        let onSuccess = this.props.success;

        return (

            <form name="form" onSubmit={handleSubmit(form => this.onSubmit(form))}>
                <Bessemer.Field name="principal" friendlyName="Pet Name"
                                validators={[Validation.requiredValidator]} />

                <Bessemer.Field name="Type" friendlyName="Type"/*Todo Radio box*/
                                validators={[Validation.requiredValidator]}
                                />

                <Bessemer.Field name="subtype" friendlyName="Sub Type"
                                validators={[Validation.requiredValidator]}/>

                <Bessemer.Field name="details" friendlyName="Optional Details"/>

                <Bessemer.Button loading={submitting}>Register</Bessemer.Button>
            </form>

        );
    }
}

RegistrationPetForm = ReduxForm.reduxForm({form: 'register'})(RegistrationPetForm);

RegistrationPetForm = connect(
    state => ({

    }),
    dispatch => ({
        register: user => dispatch(Users.Actions.register(user))
    })
)(RegistrationPetForm);

export { RegistrationPetForm };