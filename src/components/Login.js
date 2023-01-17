import React, { useState } from 'react';

import Uno from '../img/1.jpg';
import Dos from '../img/2.jpg';
import Tres from '../img/3.jpg';

import firebaseApp from '../credenciales';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth(firebaseApp);

export const Login = () => {

	const [registro, setRegistro] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const correo = e.target.email.value;
		const contraseña = e.target.contraseña.value;

		if (registro) {
			await createUserWithEmailAndPassword(auth, correo, contraseña);
		} else {
			await signInWithEmailAndPassword(auth, correo, contraseña);
		}
	}

	return (
		<div className='container p-4 row'>
			<div className="col-md-8">
				<div id="carouselExample" className="carousel slide carousel-fade">
					<div className="carousel-inner">
						<div className="carousel-item active">
							<img src={Uno} className="tamaño-imagen" alt="" />
						</div>
						<div className="carousel-item">
							<img src={Dos} className="tamaño-imagen" alt="" />
						</div>
						<div className="carousel-item">
							<img src={Tres} className="tamaño-imagen" alt="" />
						</div>
					</div>
					<button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
						<span className="carousel-control-prev-icon" aria-hidden="true"></span>
						<span className="visually-hidden">Previous</span>
					</button>
					<button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
						<span className="carousel-control-next-icon" aria-hidden="true"></span>
						<span className="visually-hidden">Next</span>
					</button>
				</div>
			</div>

			<div className="col-md-4">
				<div className='mt-5 ms-5'>
					<h1>{registro ? 'registrate' : 'inicia sesion'}</h1>
					<form onSubmit={handleSubmit}>
						<div className='mb-3'>
							<label className='form-label'>Dirección de Email: </label>
							<input type="email" className='form-control' placeholder='ingresa tu email' id='email' required />
						</div>
						<div className='mb-3'>
							<label className='form-label'>Contraseña: </label>
							<input type="password" className='form-control' placeholder='ingresa tu contraseña' id='contraseña' required />
						</div>

						<button className='btn btn-primary' type='submit'>
							{registro ? 'registrate' : 'inicia sesion'}
						</button>
					</form>

					<div className='form-group'>
						<button className='btn btn-secondary mt-4 form-control' onClick={() => setRegistro(!registro)}>
							{registro ? 'ya estas registrado? inicia sesion' : 'no tienes cuenta? Registrate'}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
