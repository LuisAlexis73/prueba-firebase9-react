import React, { useState, useEffect } from 'react';

import firebaseApp from '../credenciales';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import '@sweetalert2/theme-bootstrap-4/bootstrap-4.css'

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export const Home = ({ correoUsuario }) => {

	const valorInicial = {
		nombre: '',
		edad: '',
		profesion: ''
	}

	// Variables de estado
	const [user, setUser] = useState(valorInicial);
	const [lista, setLista] = useState([]);
	const [subId, setSubId] = useState('');

	// Funcion para capturar inputs
	const capturarInputs = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value })
	}

	// Funcionalidad para actualizar y/o guardar datos de usuario
	const guardarDatos = async (e) => {
		e.preventDefault();

		Swal.fire({
			title: 'Do you want to save the changes?',
			showDenyButton: true,
			showCancelButton: true,
			confirmButtonText: 'Save',
			denyButtonText: `Don't save`,
		}).then((result) => {
			if (result.isConfirmed) {
				if (subId === '') {
					try {
						addDoc(collection(db, 'usuarios'), {
							...user
						})
					} catch (error) {
						console.log(error);
					}
				} else {
					setDoc(doc(db, 'usuarios', subId), {
						...user
					});
				}
				Swal.fire('Saved!',
					'',
					'success'
				)
			} else if (result.isDenied) {
				Swal.fire('Changes are not saved', '', 'info')
			}
		})
		setUser({ ...valorInicial });
		setSubId('');
	}

	// Funcion para renderizar la lista de usuarios
	useEffect(() => {
		const getLista = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, 'usuarios'))
				const docs = [];
				querySnapshot.forEach((doc) => {
					docs.push({ ...doc.data(), id: doc.id })
				})
				setLista(docs);
			} catch (error) {
				console.log(error);
			}
		}
		getLista();
	}, [lista]);

	// Funcion para eliminar un usuario
	const deleteUser = async (id) => {

		Swal.fire({
			title: 'Estas seguro?',
			text: "No podrás revertir este cambio",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, eliminar!',
			cancelButtonText: 'Cancelar'
		}).then((result) => {
			if (result.isConfirmed) {
				deleteDoc(doc(db, 'usuarios', id));
				Swal.fire(
					'Eliminado!',
					'El cliente fue eliminado.',
					'success'
				)
			}
		})
	}

	const getOne = async (id) => {
		try {
			const docRef = doc(db, 'usuarios', id);
			const docSnap = await getDoc(docRef);
			setUser(docSnap.data());
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		if (subId !== '') {
			getOne(subId)
		}
	}, [subId]);

	// Alertas de verificación Sweet Alert
	const alert = () => {
		Swal.fire({
			title: '¿Estas seguro de salir?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí, cerrar sesión',
			cancelButtonText: 'Cancelar'
		}).then((result) => {
			if (result.value) {
				Swal.fire(
					signOut(auth)
				)
			}
		})
	}

	return (
		<div className='container'>
			<p>Bienvenido, <strong>{correoUsuario}</strong> Haz iniciado sesión.</p>

			<button className='btn btn-primary btn-sm' onClick={() => alert()}>
				Cerrar Sesión.
			</button>

			<hr />

			<div className='row mt-5'>
				{/* Seccion Formulario */}
				<div className="col-md-4 mt-3">
					<h3 className='text-center mb-3'>Ingresar usuario.</h3>
					<form onSubmit={guardarDatos}>
						<div className='card card-body'>
							<div className="form-group">
								<input type="text" name='nombre' className='form-control mb-3' placeholder='ingresar nombre del usuario' onChange={capturarInputs} value={user.nombre} />

								<input type="text" name='edad' className='form-control mb-3' placeholder='ingresar edad' onChange={capturarInputs} value={user.edad} />

								<input type="text" name='profesion' className='form-control mb-3' placeholder='ingresar profesion' onChange={capturarInputs} value={user.profesion} />
							</div>

							<button className='btn btn-primary'>
								{subId === '' ? 'Guardar' : 'Actualizar'}
							</button>
						</div>
					</form>
				</div>

				{/* Seccion lista de usuarios */}
				<div className="col-md-8 mt-3">
					<h2 className='text-center mb-3'>Lista de Usuarios</h2>

					<div className="container card">
						<div className="card-body">
							{
								lista.map(list => (
									<div key={list.id}>
										<hr />
										<p>Nombre: {list.nombre}</p>
										<p>Edad: {list.edad}</p>
										<p>Profesión: {list.profesion}</p>

										<button className='btn btn-danger' onClick={() => deleteUser(list.id)}>
											Eliminar
										</button>
										<button className='btn btn-success ms-4' onClick={() => setSubId(list.id)}>
											Actualizar
										</button>
									</div>
								))
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
