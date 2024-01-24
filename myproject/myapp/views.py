from django.shortcuts import render



# myapp/views.py
from rest_framework import viewsets
from .models import Table
from .serializers import TableSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
import openai
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the home page!")

# Initialize the Azure OpenAI client
client = openai.AzureOpenAI(
    azure_endpoint="",
    api_key="",
    api_version="2023-07-01-preview"
)

@api_view(['POST'])
def generate_sql_query(request):
    table_name = request.data.get('table_name', '')
    natural_language_query = request.data.get('natural_language_query', '')

    try:
        table = Table.objects.get(name=table_name)
        data_definitions = table.data_definitions
    except Table.DoesNotExist:
        return Response({'error': 'Table not found'}, status=404)

    # Generate SQL query using Azure OpenAI API
    prompt = f"Given the following data definitions:\n{data_definitions}\n\nGenerate an SQL query for the following natural language query and include only the query in the output:\n\"{natural_language_query}\"\nSQL Query:"
    message_text = [{"role": "system", "content": prompt}]

    response = client.chat.completions.create(
        model="groupseven",
        messages=message_text,
        temperature=0.7,
        max_tokens=500
    )

    # Extract the generated SQL query from the response
    generated_sql_query = response.choices[0].message.content
    print(response)
    return Response({'sql_query': generated_sql_query})

class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer
