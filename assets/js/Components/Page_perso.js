import React from 'react';
import superagent from 'superagent';
import { Redirect } from 'react-router-dom';

class Page_perso extends React.Component {

    constructor() {
        super();
        this.state = {
            username: "xxxx",
            temperature: "xxxx",
            ville: "xxxx",
            auth:true,
            errorMsg:"",
            description:"",
            url:""
        };
    }

    logout() {
        if (!this.isAuth())
            localStorage.setItem('token', '');
            this.setState({auth:false})
            this.props.history.push('');
    }
    isAuth() {
        const token = localStorage.getItem('token');
        return this.auth&&token && token.length > 10;
    }
    success(pos) {
        var mylat = pos.coords.latitude;
        var mylong = pos.coords.longitude;
        console.log(mylat,mylong)
        superagent.get('http://127.0.0.1:8000/user/localisation')
        .set('Authorization', 'BEARER ' + localStorage.getItem('token'))
        //.set('authorization',localStorage.getItem('token'))
        .set('Content-Type', 'application/json')
        //.set('accept', 'application/json')
        // .set('credentials', 'include')
        .withCredentials()
        .query({ "mylat": mylat, "mylong": mylong })
        .end((err, res) => {

            if (err.status != 200) {
                this.setState({ errorMsg: "erreur" });
                console.log(this.state.errorMsg)
                localStorage.setItem('token','');
                this.props.history.push('')
                return;
            }else{
                console.log(JSON.parse(res.text).contents)
                this.setState({ ville: JSON.parse(JSON.parse(res.text).contents).name, temperature: JSON.parse(JSON.parse(res.text).contents).main.temp + " C°", description: JSON.parse(JSON.parse(res.text).contents).weather[0].description, url: "http://openweathermap.org/img/w/" + JSON.parse(JSON.parse(res.text).contents).weather[0].icon+".png"});
                this.setState({ errorMsg: "" });
                this.setState({ username: localStorage.getItem('email').split('@')[0] });
            }
        })

    }
    failure() {

    }
    componentDidMount() {
        let x = navigator.geolocation;
        x.getCurrentPosition(this.success.bind(this), this.failure.bind(this));
    }
    render() {
        return (
                <div>
                <button onClick={this.logout.bind(this)}>Se Deconnecter</button>
                <br/>
                <div>Bienvenu <b>{this.state.username}</b></div>
                <div>Vous êtes à <b>{ this.state.ville }</b></div>
                <div style={{marginLeft:'100px'}}><img width="120px" src={this.state.url}/></div>
                <div>La Température <b>{ this.state.temperature }</b></div>
                <div>Il est {this.state.description}</div>
                </div>
            )
    }
}

export default Page_perso;