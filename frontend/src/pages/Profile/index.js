import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import logoImg from '../../assets/logo.svg';
import api from '../../services/api';
import './styles.css'; 

export default function Profile(){
    const [incidents, setIncidents] = useState([]);

    const history = useHistory();

    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');

    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId,
            }
        }).then(res => {
            setIncidents(res.data);
        })
    }, [ongId]);

   async function handleDeleteIncident(id){
        try {
          await api.delete(`incidents/${id}`, {
              headers: {
                  Authorization: ongId,
              }
          }); 
          
          setIncidents(incidents.filter(incidents => incidents.id !== id));
        } catch(err){
            alert('Error ao deletar caso, tente novamente. Obrigado!')
        }
    }

    function handleLogout(){
        localStorage.clear();

        history.push('/');
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero" />
                <span>Bem vindo, {ongName}</span>

                <Link className="button" to="/incident/new">Cadastrar novo caso</Link>
                <button onClick={handleLogout} type="button">
                <FiPower size={18} color="#E02041"/>
                </button>
            </header>
            <h1>Casos cadastrados</h1>
            <ul>
            {incidents.map(incidents => (
                     <li key={incidents.id}>
                     <strong>CASO:</strong>
                     <p>{incidents.title}</p>
 
                     <strong>DESCRIÇÃO</strong>
                     <p>{incidents.description}</p>
 
                     <strong>VALOR:</strong>
                     <p>{Intl.NumberFormat('pt-BR',{ style: 'currency', currency: 'BRL' }).format(incidents.value)}</p>
 
                     <button onClick={() => handleDeleteIncident(incidents.id)} type="button">
                         <FiTrash2 size={20} color="#a8a8b3" />
                     </button>
                 </li>   
            ))}
            </ul>
        </div>
    );
}