import React, { useState, useEffect } from 'react';

import firebaseApp from '../credenciales';
import { getAuth, signOut } from 'firebase/auth';

import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';

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

		if (subId === '') {
			try {
				await addDoc(collection(db, 'usuarios'), {
					...user
				})
			} catch (error) {
				console.log(error);
			}
		} else {
			await setDoc(doc(db, 'usuarios', subId), {
				...user
			});
		}
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
		await deleteDoc(doc(db, 'usuarios', id));
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
	}, [subId])

	return (
		<div className='container'>
			<p>Bienvenido, <strong>{correoUsuario}</strong> Haz iniciado sesión.</p>

			<button className='btn btn-primary' onClick={() => signOut(auth)}>
				Cerrar Sesión.
			</button>

			<hr />

			<div className='row'>
				{/* Seccion Formulario */}
				<div className="col-md-4">
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
				<div className="col-md-8">
					<h2 className='text-center mb-3'>Lista de Usuarios</h2>

					<div className="container card">
						<div className="card-body">
							{
								lista.map(list => (
									<div key={list.id}>
										<p>Nombre: {list.nombre}</p>
										<p>Edad: {list.edad}</p>
										<p>Profesión: {list.profesion}</p>

										<button className='btn btn-danger' onClick={() => deleteUser(list.id)}>
											Eliminar
										</button>
										<button className='btn btn-success ms-4' onClick={() => setSubId(list.id)}>
											Actualizar
										</button>
										<hr />
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
